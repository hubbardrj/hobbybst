from rest_framework import generics
from rest_framework import filters

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import Sport, Player
from .serializers import PlayerSerializer, SportSerializer

class SportList(generics.ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SportSerializer
    
    def get_queryset(self):
        return Sport.objects.all()

class PlayerList(generics.ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PlayerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name']

    def get_queryset(self):
        return Player.objects.all()