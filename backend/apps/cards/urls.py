# cards/urls.py
from django.urls import path, include
from . import views

urlpatterns = [
    path('cards/', views.ListCard.as_view()),
    path('cards/<int:pk>/', views.DetailCard.as_view()),
]