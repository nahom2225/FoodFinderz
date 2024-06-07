from django.urls import path
from .views import index

urlpatterns = [
    path('', index, name = 'home'),
    path('create-account', index),
    path('frontpage', index),
    path('login', index),
    path('create-post', index),
    path('frontpage/<str:post_id>', index),
    path('account/<str:username>', index),
    path('edit-post/<str:op>/<str:post_id>', index)
]