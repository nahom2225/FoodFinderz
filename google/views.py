from django.shortcuts import render
from django.http import JsonResponse
import requests
from .credentials import *
from rest_framework import serializers, renderers
from rest_framework.response import Response 
from rest_framework import generics, status
from rest_framework.views import APIView
from django.utils import timezone
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from rest_framework.exceptions import ValidationError
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.core.paginator import Paginator
from rest_framework.renderers import JSONRenderer

class AutoCompleteLoc(APIView):
    def get(self, request, loc, format=None):
        location = loc
        api_key = GOOGLE_MAPS_API_KEY  # Replace this with your Google Maps API key

        if location == "":
            return Response({"error": "Location parameter is missing."}, status=400)

        # Make the request to Google Maps API
        url = "https://maps.googleapis.com/maps/api/place/autocomplete/json"
        params = {
            "input": location,
            "key": api_key,
            "types": "geocode",  # You can adjust the types parameter as needed
        }

        response = requests.get(url, params=params)

        if response.status_code == 200:
            data = response.json()
            print(data)
            return Response(data)
        else:
            return Response({"error": "Failed to fetch location suggestions."}, status=500)
