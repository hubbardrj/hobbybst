# cards/urls.py
from django.urls import path, include
from . import views

urlpatterns = [
    path('brands/', views.ListBrand.as_view()),
    path('cards/', views.ListCard.as_view()),
    path('cards/<int:pk>/', views.DetailCard.as_view()),
    path('checklists/', views.ListChecklist.as_view()),
    path('files/', views.UploadFile.as_view()),
]