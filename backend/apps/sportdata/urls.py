# sportdata/urls.py
from django.urls import path, include
from . import views

urlpatterns = [
    path('sports/', views.SportList.as_view()),
    path('players/', views.PlayerList.as_view()),
    path('teams/', views.TeamList.as_view()),
]