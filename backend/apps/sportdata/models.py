from django.db import models

# Create your models here.
class Sport(models.Model):
    name = models.CharField(max_length=200, null=False)
    abbr = models.CharField(max_length=20, null=False)

    def __str__(self):
        return self.abbr

class Team(models.Model):
    name = models.CharField(max_length=200)
    sport = models.ForeignKey(Sport, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Player(models.Model):
    full_name = models.CharField(max_length=200, default='', null=False)
    first_name = models.CharField(max_length=200, null=True, blank=True)
    last_name = models.CharField(max_length=200, null=True, blank=True)
    player_code = models.IntegerField(null=True, blank=True)
    sport = models.ForeignKey(Sport, on_delete=models.CASCADE)

    def __str__(self):
        return self.full_name

