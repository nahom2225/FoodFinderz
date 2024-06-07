from django.urls import path
from .views import*
from django.contrib.auth import views as auth_views
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required


urlpatterns = [
    path('get-auto-loc/<str:loc>', AutoCompleteLoc.as_view())                                                                                                                                                               
]


