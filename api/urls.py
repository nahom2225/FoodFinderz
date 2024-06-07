from django.urls import path
from .views import*
from django.contrib.auth import views as auth_views
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required


urlpatterns = [
    path('create-account', CreateAccountView.as_view()),
    path('all-accounts', AccountView.as_view()),
    path('all-posts', PostView.as_view()),
    path('login', LoginAccountView.as_view(), name = "login"),
    path('get-account', GetAccount.as_view()),
    path('logout/', MyLogoutView.as_view(), name='logout'),
    path('account-in-session', AccountInSession.as_view()),
    path('create-post', CreatePost.as_view()),
    path('get-posts/<int:page>/<int:posts_per_page>', PostsList.as_view()),
    path('get-post-info/<str:post_id>', GetPost.as_view()),
    path('post-vote/<int:upvote>', Vote.as_view()),
    path('get-post-vote/<str:post_id>', VoteCheck.as_view()),
    path('delete-post', DeletePost.as_view()),
    path('account', AccountPage.as_view()),
    path('get-your-posts/<str:account>/<int:page>/<int:posts_per_page>', YourPostsList.as_view()),   
    path('edit-post/<str:post_id>', EditPost.as_view())                                                                                                                                                           
]


