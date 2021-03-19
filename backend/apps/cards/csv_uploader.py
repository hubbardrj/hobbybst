import csv

from django.db.utils import IntegrityError
from django.core.exceptions import FieldDoesNotExist
from django.db import transaction
from .models import ChecklistCard

class CsvUploader:

    def __init__(self, csv_file, model, parent):
        self.reader = list(csv.DictReader(csv_file, delimiter=','))
        self.keys = [k for k in self.reader[0]]
        self.model = model
        self.model_fields = [f.name for f in  model._meta.get_fields()]
        self.valid = self._validate_csv()
        self.csv_pos = 0
        self.parent = parent

    def _validate_csv(self):

        keys = []
        for k in self.keys:
            if k.endswith("_id"):
                keys.append(k[:-3])
            else:
                keys.append(k)
        return set(keys).issubset(self.model.csv_fields)

    def map_checklist(self, row):
        return {
            'Checklist': self.checklist,
            'set_name': row['Set'],
            'player_name':row['Player'],
            'team_name': row['Team'],
            'seq': None if row['Seq'] == '' else row['Seq'],
            'other': row['Other']
        }
    def read_chunk(self):
        chunk = []
        for i in range(1000):
            try:
                chunk.append(self.model(**self.map_checklist(self.reader[self.csv_pos])))
            except IndexError as e:
                print(e)
                break
            self.csv_pos += 1
        return chunk
    
    def process_checklist(self, form):

        with transaction.atomic():
            instance = form.save()
            self.checklist = instance
            self.create_cards()
        return "success"

    def create_cards(self):
        if not self.valid:
            raise Exception("The CSV is not valid")

        while True:
            chunk = self.read_chunk()

            if not chunk:
                break

            try:
                with transaction.atomic():
                    ChecklistCard.objects.bulk_create(chunk)
            except IntegrityError as e:
                for i in chunk:
                    try:
                        i.save()
                    except IntegrityError:
                        continue
                print("Exeption: {}".format(e))

        return "records succesfully saved!"

    def create_records(self):

        if not self.valid:
            raise Exception("The CSV is not valid")
        
        while True:
            chunk = self.read_chunk()

            if not chunk:
                break

            try:
                with transaction.atomic():
                    self.model.objects.bulk_create(chunk)
            except IntegrityError as e:
                for i in chunk:
                    try:
                        i.save()
                    except IntegrityError:
                        continue
                print("Exeption: {}".format(e))

        return "records succesfully saved!"
