from django.db import models

# Create your models here.
class Sport(models.Model):
    name = models.CharField(max_length=200, null=False)
    abbr = models.CharField(max_length=20, null=False)

    def __str___(self):
        return self.name

class Team(models.Model):
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100, null=False)

    def __str___(self):
        return self.city + ' '+self.name

class Player(models.Model):
    first_name = models.CharField(max_length=200, null=False)
    last_name = models.CharField(max_length=200, null=False)
    player_id = models.IntegerField()

    def __str___(self):
        return self.first_name + ' ' + self.last_name

