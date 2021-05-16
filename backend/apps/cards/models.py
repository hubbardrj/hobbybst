from django.db import models
from django.db.models.deletion import SET_NULL
from ..users.models import User
from ..sportdata.models import Sport, Player, Team

class Brand(models.Model):
    company = models.CharField(max_length=100, null=True)
    name = models.CharField(max_length=200)
    sport = models.ForeignKey(Sport, on_delete=models.CASCADE)

    def __str__(self):
        return ''.join([self.company, ' ', self.name])

class Card(models.Model):
    brand = models.ForeignKey(Brand, null=True, on_delete=models.SET_NULL, related_name='brand')
    player_name = models.CharField(max_length=200, null=False)
    player = models.ForeignKey(Player, null=True, blank=True, on_delete=models.SET_NULL)
    card_number = models.CharField(max_length=20, null=False)
    set_name = models.CharField(max_length=200)
    set_year = models.IntegerField()
    team = models.ForeignKey(Team, null=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    front_of_card = models.URLField(null=True, blank=True)
    back_of_card = models.URLField(null=True, blank=True )
    seq = models.CharField(max_length=20, default='', blank=True)
    notes = models.CharField(max_length=50, default='', blank=True)

    def __str__(self):
        return self.player_name

class Checklist(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    product = models.CharField(max_length=200)
    year = models.IntegerField()

    def __str__(self):
        return self.product+' Checklist'

class ChecklistCard(models.Model):
    Checklist = models.ForeignKey(Checklist, on_delete=models.CASCADE, related_name='checklist')
    set_name = models.CharField(max_length=200)
    player_name = models.CharField(max_length=200)
    card_number = models.CharField(max_length=20, null=False, default='')
    team_name = models.CharField(max_length=200, null=True)
    seq = models.CharField(max_length=20, default=None)
    other = models.CharField(max_length=50, null=True)

    def __str__(self):
        return ''.join([self.set_name,  ' ',self.player_name]) 

    csv_fields = [
        'Set',
        'Player',
        'Team',
        'Number',
        'Seq',
        'Other'
    ]