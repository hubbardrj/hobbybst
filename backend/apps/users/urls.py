from django.urls import path, include
from . import views

urlpatterns = [
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('login/', views.APILoginView.as_view(), name='api_login'),
    path('logout/', views.APILogoutView.as_view(), name='api_logout'),
    path('user/', views.APIUserView.as_view(), name='api_user'),
    path('google/', views.GoogleLogin.as_view(), name='google_login')
]