from django.contrib import admin, messages
from django.urls import path
from django.shortcuts import render

from .models import Card, Brand, Checklist, ChecklistCard
from .forms import CsvImportForm
from .csv_uploader import CsvUploader

import io

admin.site.register(Brand)
admin.site.register(Card)
admin.site.register(ChecklistCard)

class CsvUploadAdmin(admin.ModelAdmin):
    change_list_template = "change_checklist.html"

    def get_urls(self):
        urls = super().get_urls()
        additional_urls = [
            path("import/checklist", self.import_csv),
        ]
        return additional_urls + urls

    def import_csv(self, request):
        if request.method == "POST":
            form = CsvImportForm(request.POST, request.FILES)
            if form.is_valid():
                print(request.FILES['csv_file'].name)
                if request.FILES['csv_file'].name.endswith('csv'):

                    try:
                        decoded_file = request.FILES['csv_file'].read().decode('utf-8')
                    except UnicodeDecodeError as e:
                        self.message_user(
                            request,
                            "There was an error decoding the file:{}".format(e),
                            level=messages.ERROR
                        )
                        return redirect("..")

                    # Here we will call our class method
                    io_string = io.StringIO(decoded_file)
                    uploader = CsvUploader(io_string, ChecklistCard, self.model)
                    try: 
                        result = uploader.process_checklist(form)
                    
                    except Exception as e:
                        self.message_user(request,e,level=messages.ERROR)

                else:
                    self.message_user(
                    request,
                    "Incorrect file type: {}".format(
                        request.FILES['csv_file'].name.split(".")[1]
                        ),
                    level=messages.ERROR
                    )
            else:
                self.message_user(
                    request,
                    "There was an error in the form {}".format(form.errors),
                    level=messages.ERROR
                )

        form = CsvImportForm()
        payload = {"csv_import_form": form, "title": 'Upload Checklist CSV File', "site_header": 'Django administration'}
        return render(
            request, "upload_checklist.html", payload
        )


@admin.register(Checklist)
class ChecklistAdmin(CsvUploadAdmin):
    pass
