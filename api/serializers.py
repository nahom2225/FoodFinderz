from rest_framework import serializers
from .models import Account, Post
from django.contrib.auth import get_user_model

#Takes models with all python related code, and translates to a JSON resposne
#Takes keys turns to strings

        
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class CreateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('username', 'password', 'account_id')

class LoginAccountSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class CreatePostSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Post
        fields = ('title', 'food', 'location', 'description', 'account_poster', 'food_left')
        extra_kwargs = {
            'description': {'required': False, 'allow_null': True, 'allow_blank': True},
        }

class PostSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Post
        fields = '__all__'
        extra_kwargs = {
            'description': {'required': False, 'allow_null': True, 'allow_blank': True},
        }

class GetPostSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Post
        fields = ('post_id',)

class AccountPage(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('username', )
