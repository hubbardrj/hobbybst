from django.contrib import admin

# Register your models here.
from .models import Player, Sport, Team

admin.site.register(Sport)
admin.site.register(Team)
admin.site.register(Player)