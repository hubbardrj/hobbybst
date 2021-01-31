from dj_rest_auth.views import (LoginView, LogoutView, PasswordChangeView, UserDetailsView)
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.middleware.csrf import get_token
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.serializers import TokenSerializer, UserDetailsSerializer
from rest_framework.response import Response

# Create your views here.
def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response

class APILogoutView(LogoutView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

class APILoginView(LoginView):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        orginal_response = super().post(request)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        mydata = {"user": UserDetailsSerializer(user, context=self.get_serializer_context()).data}
        orginal_response.data.update(mydata)
        
        return orginal_response


class APIUserView(UserDetailsView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    pass

class APIPasswordUpdateView(PasswordChangeView):
    authentication_classes = [SessionAuthentication]

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    def post(self, request, *args, **kwargs):
        orginal_response = super().post(request)
        mydata = {"user": UserDetailsSerializer(self.user, context=self.get_serializer_context()).data}
        orginal_response.data.update(mydata)
        
        return orginal_response