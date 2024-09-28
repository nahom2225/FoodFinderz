from django.shortcuts import render
from rest_framework import serializers, renderers
from rest_framework.response import Response 
from rest_framework import generics, status
from .serializers import*
from .models import Account, Post
from rest_framework.views import APIView
from django.http import JsonResponse
from django.utils import timezone
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.models import AbstractUser, User
from django.contrib.auth.hashers import make_password
from rest_framework.exceptions import ValidationError
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.core.paginator import Paginator
from rest_framework.renderers import JSONRenderer
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view


# Create your views here.
CORS_ALLOW_CREDENTIALS = True

@csrf_exempt
def getCSRFToken(request):
    token = get_token(request)
    return JsonResponse({"token": token}, status=200)

class AccountView(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class PostView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer    


class CreateAccountView(APIView):
    serializer_class = CreateAccountSerializer
    @method_decorator(ensure_csrf_cookie)
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            current_session = self.request.session.session_key
            queryset = Account.objects.filter(username=username)
            if queryset.exists():
                return Response({'Bad User': 'Username Taken'}, status=status.HTTP_409_CONFLICT)
            else:
                account = Account.objects.create_user(username=username, password=make_password(password))
                account.current_session = current_session
                account.save()
                self.request.session['account_id'] = account.account_id
                user = User.objects.create_user(username, email = None, password = password)
                #user = authenticate(username=username, password=password)
                if user is not None:
                    user.backend = 'django.contrib.auth.backends.ModelBackend'
                    login(request, user)
                return Response(CreateAccountSerializer(account).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_409_CONFLICT)

    
class LoginAccountView(APIView):
    serializer_class = LoginAccountSerializer
    @method_decorator(ensure_csrf_cookie)
    def post(self, request, format=None):
        print("______")
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')
            if username and password:
                user = authenticate(request = request, username=username, password=password)
                if user is not None:
                    account = Account.objects.filter(username = username)[0]
                    login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                    self.request.session['account_id'] = account.account_id
                    self.request.session.modified = True
                    self.request.session.save()
                    account.last_login = timezone.now()
                    account.current_session = self.request.session.session_key
                    account.save(update_fields=['current_session', 'last_login'])
                    return Response({'username': user.username, 'account_id': account.account_id}, status=status.HTTP_200_OK)
                else:
                    print("here")
                    return Response({'error': 'Invalid Password or Username'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                if not username:
                    return Response({'error': 'Missing Username'}, status=status.HTTP_400_BAD_REQUEST)
                if not password:
                    return Response({'error': 'Missing Password'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print(serializer.errors)
            return Response({'error': 'Missing Username or Password'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)
            

class GetAccount(APIView):
    serializer_class = AccountSerializer
    lookup_url_kwarg = 'account_id'

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, format = None):
        # Log CSRF token from headers and cookies
        csrf_token_from_header = request.META.get('HTTP_X_CSRFTOKEN')
        csrf_token_from_cookie = request.COOKIES.get('csrftoken')
        print(f"CSRF Token from header: {csrf_token_from_header}")
        print(f"CSRF Token from cookie: {csrf_token_from_cookie}")
        print(f"Is user authenticated? {self.request.user.is_authenticated}")
        print("HEREEEE")
        print(self.request.session.keys())
        print(self.request.session.get('account_id'))
        if self.request.user.is_authenticated:
            print("here1")
            account = Account.objects.filter(username = self.request.user.username)
            if len(account) > 0:
                account = account[0]
                self.request.session[self.lookup_url_kwarg] = account.account_id
                self.request.session.modified = True
                data = AccountSerializer(account).data
                return Response(data, status = status.HTTP_200_OK)
        else:
            print("here2")
            account_id = self.request.session.get('account_id')
            if account_id != None:
                account = Account.objects.filter(account_id=account_id)
                if len(account) > 0:
                    data = AccountSerializer(account[0]).data
                    return Response(data, status = status.HTTP_200_OK)
                return Response({'Account Not Found': 'Invalid Account Access.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request':'Account Not Found'}, status=status.HTTP_404_NOT_FOUND)

class MyLoginView(LoginView):
    template_name = 'login.html'

class MyLogoutView(APIView):
    #template_name = 'login.html'
    serializer_class = AccountSerializer
    lookup_url_kwarg = 'account_id'

    def get(self, request, format = None):
        account_id = self.request.session.get(self.lookup_url_kwarg)
        if self.request.user.is_authenticated or account_id:
            #account = Account.objects.filter(accountId)
            #account.account_id = None
            #account.save(update_fields=['account_id'])
            
            # Reset upvotes, downvotes, and votes count for all posts
            # Post.objects.all().update(upvotes=0, downvotes=0, votes=0)

            # Clear upvoted_posts and downvoted_posts for all accounts
            # for account in Account.objects.all():
                # account.upvoted_posts.clear()
                # account.downvoted_posts.clear()            

            self.request.session[self.lookup_url_kwarg] = None
            logout(request)
            return redirect('home')
        return Response({'Account Not Found': 'Invalid Account Access.'}, status=status.HTTP_404_NOT_FOUND)
    



def logout_view(request):
    logout(request)
    return redirect('home')

class AccountInSession(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'account_id': self.request.session.get('account_id')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)
    
class CreatePost(APIView):
    serializer_class = CreatePostSerializer
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            queryset = Post.objects.filter(title=serializer.validated_data.get('title'), description=serializer.validated_data.get('description'))
            if queryset.exists():
                return Response({'error': 'Duplicate Post'}, status=status.HTTP_409_CONFLICT)
            else:
                post = serializer.save(posted=True, created_at = timezone.now())
                account_poster = serializer.validated_data.get('account_poster')
                account = Account.objects.get(username=account_poster)
                account.posts.add(post)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        errors = serializer.errors
        print(errors)
        return Response({'error': 'Missing Information'}, status=status.HTTP_400_BAD_REQUEST)
    
class EditPost(APIView):
    serializer_class = CreatePostSerializer
    lookup_url_kwarg = 'account_id'

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, post_id, format=None):
        # Log CSRF token from headers and cookies
        csrf_token_from_header = request.META.get('HTTP_X_CSRFTOKEN')
        csrf_token_from_cookie = request.COOKIES.get('csrftoken')
        print(f"CSRF Token from header: {csrf_token_from_header}")
        print(f"CSRF Token from cookie: {csrf_token_from_cookie}")   
        print(f"Is user authenticated? {self.request.user.is_authenticated}")
        serializer = self.serializer_class(data=request.data)
        
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        account_id = self.request.session.get(self.lookup_url_kwarg)  
        if account_id == None and self.request.user.is_authenticated:
            print("please")
            account = Account.objects.filter(username = self.request.user.username)
            if len(account) > 0:
                account_id = account[0].account_id
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            queryset = Post.objects.filter(post_id = post_id)
            if queryset.exists():
                post = queryset[0]
                serializer = self.serializer_class(instance=post, data=request.data)
                account = Account.objects.filter(account_id=account_id)
                print(account_id, account)
                if post.account_poster == account[0].username and serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status = status.HTTP_202_ACCEPTED)
                elif post.account_poster == account[0].username:
                    return Response({'error': 'Invalid Access to Post'}, status=status.HTTP_403_FORBIDDEN)
                else:
                    return Response({'error': 'Invalid Data', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Post Not Found'}, status=status.HTTP_404_NOT_FOUND)
        errors = serializer.errors
        print(errors)  
        print("HERE")
        print(serializer.is_valid())
        print(serializer)
        return Response({'error': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)
    
#@api_view(['GET'])
class PostsList(APIView):    

    def get(self, request, page, posts_per_page):
        posts = Post.objects.order_by('-created_at')
        paginator = Paginator(posts, posts_per_page)
        paginated_posts = paginator.get_page(page)
        serializer = PostSerializer(paginated_posts, many=True)
        response_data = {
            'count': posts.count(),
            'results': serializer.data
        }
        return Response(response_data)     
    
class YourPostsList(APIView):    

    def get(self, request, page, posts_per_page, account):
        posts = Post.objects.order_by('-created_at').filter(account_poster = account)
        paginator = Paginator(posts, posts_per_page)
        paginated_posts = paginator.get_page(page)
        serializer = PostSerializer(paginated_posts, many=True)
        response_data = {
            'count': posts.count(),
            'results': serializer.data
        }
        return Response(response_data)   

class GetPost(APIView):
    serializer_class = GetPostSerializer    
    lookup_url_kwarg = 'account_id'

    def get(self, request, post_id, format = None):
        print("HEREEEE")
        print(self.request.session.keys())
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            #post_id = serializer.data.get('post_id')            
            posts = Post.objects.filter(post_id = post_id)
            if len(posts) > 0:
                data = PostSerializer(posts[0]).data
                return Response(data, status = status.HTTP_200_OK)
            print("PostId:", post_id)
            print("NO POSTS")
            return Response({'Post Not Found': 'No Post Exists.'}, status=status.HTTP_404_NOT_FOUND)                
        errors = serializer.errors
        print("PostId:", post_id)
        print('Serializer errors:', errors)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_409_CONFLICT)
    
class Vote(APIView):
    serializer_class = GetPostSerializer    
    lookup_url_kwarg = 'account_id'    

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, upvote, format = None):     
        # Log CSRF token from headers and cookies
        csrf_token_from_header = request.META.get('HTTP_X_CSRFTOKEN')
        csrf_token_from_cookie = request.COOKIES.get('csrftoken')
        print(f"CSRF Token from header: {csrf_token_from_header}")
        print(f"CSRF Token from cookie: {csrf_token_from_cookie}")   
        print(f"Is user authenticated? {self.request.user.is_authenticated}")
        serializer = self.serializer_class(data=request.data)
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()                
        print("HEREEEE")
        print(self.request.session.keys())
        account_id = self.request.session.get(self.lookup_url_kwarg)  
        if account_id == None and self.request.user.is_authenticated:
            print("please")
            account = Account.objects.filter(username = self.request.user.username)
            if len(account) > 0:
                account_id = account[0].account_id
        print(account_id)
        print(request.user.is_authenticated())
        print(serializer.is_valid())
        if serializer.is_valid():
            if account_id is not None:
                account = Account.objects.filter(account_id = account_id)
                account = account[0]
                post_id = serializer.data.get('post_id')
                post = Post.objects.filter(post_id = post_id)
                post = post[0]
                if account is not None and post_id is not None:
                    if upvote:
                        post.upvotes += int(post not in account.upvoted_posts.all())
                        post.downvotes -= int(post in account.downvoted_posts.all())
                        post.votes = post.votes + (int(post not in account.upvoted_posts.all()) + int(post in account.downvoted_posts.all())) - (int(post in account.upvoted_posts.all()))
                        if post not in account.upvoted_posts.all():
                            account.upvoted_posts.add(post)
                        else:
                            account.upvoted_posts.remove(post)
                        account.downvoted_posts.remove(post)
                        account.save()
                        post.save(update_fields=['upvotes', 'votes', 'downvotes'])
                    elif not upvote:
                        post.downvotes += int(post not in account.downvoted_posts.all())
                        post.upvotes -= int(post in account.upvoted_posts.all())
                        post.votes = post.votes - (int(post not in account.downvoted_posts.all()) + int(post in account.upvoted_posts.all())) + (int(post in account.downvoted_posts.all()))
                        if post not in account.downvoted_posts.all():
                            account.downvoted_posts.add(post)
                        else:
                            account.downvoted_posts.remove(post)
                        account.upvoted_posts.remove(post)
                        account.save()
                        post.save(update_fields=['downvotes', 'votes', 'upvotes'])
                    data = {'votes': post.votes, 'upvote': post in account.upvoted_posts.all() , 'downvote' : post in account.downvoted_posts.all()}
                    return JsonResponse(data, status=status.HTTP_200_OK)
                else:
                    return Response({'Account Not Found': 'Invalid Account Access.'}, status=status.HTTP_404_NOT_FOUND)    
            else:
                return Response({'Account Not Found': 'Invalid Account Access.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_409_CONFLICT)
    
class VoteCheck(APIView):
    serializer_class = AccountPage
    lookup_url_kwarg = 'account_id'   

    def get(self, request, post_id, username, format=None):
        serializer = self.serializer_class(data=request.GET)  
        if post_id and username:
            #username = serializer.validated_data.get('username')
            accounts = Account.objects.filter(username=username)
            posts = Post.objects.filter(post_id=post_id)
            if accounts.exists() and posts.exists():
                account = accounts.first()
                post = posts.first()
                data = {'upvote': post in account.upvoted_posts.all(), 'downvote': post in account.downvoted_posts.all()}
                return JsonResponse(data, status=status.HTTP_200_OK)
            return Response({'Post Not Found': 'No Post Exists.'}, status=status.HTTP_404_NOT_FOUND)
        print(serializer.errors)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_409_CONFLICT)

    
class DeletePost(RetrieveUpdateDestroyAPIView):
    serializer_class = GetPostSerializer

    @method_decorator(ensure_csrf_cookie)
    def destroy(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            post_id = serializer.data.get('post_id')
            post = Post.objects.filter(post_id=post_id).first()
            if post:
                post.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        
class AccountPage(APIView):
    serializer_class = AccountPage    
    lookup_url_kwarg = 'account_id'   

    def post(self, request, format = None):
        if not self.request.session.exists(self.request.session.session_key):
                self.request.session.create()
        account_id = self.request.session.get(self.lookup_url_kwarg)  
        if account_id == None and self.request.user.is_authenticated:
            account = Account.objects.filter(username = self.request.user.username)
            if len(account) > 0:
                account_id = account[0].account_id  
        if account_id != None:
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():         
                target_account = Account.objects.filter(account_id = serializer.data.get('username'))
                if len(target_account) > 0:
                    target_account = target_account[0]
                    if account_id == target_account.account_id:
                        return JsonResponse(serializer.data.get('username'), status = status.HTTP_200_OK)
                    return JsonResponse({'No Access'}, status=status.HTTP_200_OK)
                return Response({'Target Account Not Found': 'No Account Exists.'}, status=status.HTTP_404_NOT_FOUND)                
            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_409_CONFLICT)
        return Response({'Account Not Found': 'Invalid Account Access.'}, status=status.HTTP_404_NOT_FOUND)

