# cards/views.py
from rest_framework import generics

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import Card
from .serializers import CardSerializer


class ListCard(generics.ListCreateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CardSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        user = self.request.user
        return Card.objects.filter(user=user)


class DetailCard(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = CardSerializer
    def get_queryset(self):
        user = self.request.user
        return Card.objects.filter(user=user)
