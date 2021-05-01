from django import forms 
from .models import Brand, Checklist
from .widget import RelatedFieldWidgetCanAdd
from ..sportdata.models import Sport

class CsvImportForm(forms.ModelForm):
    class Media:
        js = ('admin/js/admin/RelatedObjectLookups.js',)

    class Meta:
        model = Checklist
        fields = ('brand','year')

    brand = forms.ModelChoiceField(
        queryset=Brand.objects.all(),
        widget=RelatedFieldWidgetCanAdd(Brand, related_url='admin:cards_brand_add'))

    csv_file = forms.FileField()

