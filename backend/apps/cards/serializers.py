# todos/serializers.py
from rest_framework import serializers
from .models import Card


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'player_name',
            'card_number',
            'set_name',
            'set_year'
        )
        model = Card