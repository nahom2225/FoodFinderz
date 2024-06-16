# middleware.py
from django.http import JsonResponse

def preflight_response():
    response = JsonResponse({'detail': 'Preflight response'}, status=200)
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Credentials'] = 'true'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, DELETE, PUT'
    response['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token, Authorization, ngrok-skip-browser-warning, SameSite'
    return response

class CustomCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            return preflight_response()
        response = self.get_response(request)
        return self.process_response(request, response)

    def process_response(self, request, response):
        response['Access-Control-Allow-Origin'] = request.headers.get('Origin')
        response['Access-Control-Allow-Credentials'] = 'true'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, DELETE, PUT'
        response['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token, Authorization, ngrok-skip-browser-warning, SameSite'
        return response
