# cards/views.py
from botocore import serialize
from rest_framework import generics, filters

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import Serializer

from .models import Brand, Card, Checklist
from .serializers import BrandSerializer, CardSerializer, ChecklistSerializer, FileUploadSerializer, S3ResponseSerializer
from rest_framework.response import Response
from rest_framework import status


class ListCard(generics.ListCreateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CardSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Card.objects.filter(user=user)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(ListCard, self).get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        ##data = serializer.data[:]
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def post(self, request, *args, **kwargs):
        return super(ListCard, self).post(request, *args, **kwargs)

class DetailCard(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = CardSerializer
    def get_queryset(self):
        user = self.request.user
        return Card.objects.filter(user=user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class ListChecklist(generics.ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = ChecklistSerializer
    def get_queryset(self):
        queryset = Checklist.objects.all()
        brand_id = self.request.query_params.get('brand_id', None)
        year = self.request.query_params.get('year', None)
        if brand_id is not None and year is not None:
            queryset = queryset.filter(brand__id=brand_id, year=year)
            return queryset
        return None

class ListBrand(generics.ListAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BrandSerializer
    filter_backends = [filters.SearchFilter]

    def get_queryset(self):
        queryset = Brand.objects.all()
        sport = self.request.query_params.get('sport', None)
        if sport is not None:
            queryset = queryset.filter(sport__abbr__iexact=sport)
        return queryset

class UploadFile(generics.CreateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FileUploadSerializer

    def post(self, request, *args, **kwargs):
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            response = serializer.save(user=self.request.user)
            output = S3ResponseSerializer(response)
            return Response(output.data)
        else:
            return Response(serializer.errors, 400)
