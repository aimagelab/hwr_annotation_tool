from . import views
from django.urls import path, re_path
from django.contrib.auth import views as auth_views

app_name = 'hwr'
urlpatterns = [
    path('', views.index),
    path('annota/', views.annota),
    re_path(r'logout/', auth_views.LogoutView.as_view(), name='logout')

]
