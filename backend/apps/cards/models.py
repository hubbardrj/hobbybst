from django.db import models
from ..users.models import User

# Create your models here.
class Card(models.Model):
    player_name = models.CharField(max_length=200)
    card_number = models.CharField(max_length=20, null=False)
    set_name = models.CharField(max_length=200)
    set_year = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str___(self):
        return self.player_name

class CardCompany(models.Model):
    name = models.CharField(max_length=200)

    def __str___(self):
        return self.name