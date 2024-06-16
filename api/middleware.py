from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin

def preflight_response():
    response = JsonResponse({'detail': 'Preflight response'}, status=200)
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Credentials'] = 'true'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, DELETE, PUT'
    response['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token, Authorization, ngrok-skip-browser-warning, SameSite'
    return response

def custom_options_middleware(get_response):
    def middleware(request):
        if request.method == "OPTIONS":
            return preflight_response()
        response = get_response(request)
        return response
    return middleware

class CustomCorsMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.method == "OPTIONS":
            response = self.process_response(request, JsonResponse({'detail': 'Preflight response'}, status=200))
            return response

    def process_response(self, request, response):
        response['Access-Control-Allow-Origin'] = request.headers.get('Origin')
        response['Access-Control-Allow-Credentials'] = 'true'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, DELETE, PUT'
        response['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token, Authorization, ngrok-skip-browser-warning, SameSite'
        return response