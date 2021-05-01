from rest_framework import generics, filters

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import Sport, Player, Team
from .serializers import PlayerSerializer, SportSerializer, TeamSerializer

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
        queryset = Player.objects.all()
        sport = self.request.query_params.get('sport', None)
        if sport is not None:
            queryset = queryset.filter(sport__abbr__iexact=sport)
        return queryset

class TeamList(generics.ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TeamSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name']

    def get_queryset(self):
        queryset = Team.objects.all()
        sport = self.request.query_params.get('sport', None)
        if sport is not None:
            queryset = queryset.filter(sport__abbr__iexact=sport)
        return queryset