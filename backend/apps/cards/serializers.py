# todos/serializers.py
from django.db import transaction
from rest_framework import serializers
from ..sportdata.serializers import SportSerializer, PlayerSerializer, TeamSerializer
from ..sportdata.models import Sport, Player, Team
from .models import Card, Brand

class CardSerializer(serializers.ModelSerializer):
    team_name = serializers.StringRelatedField(source='team', many=False)
    brand = serializers.StringRelatedField(many=False)
    player_name = serializers.StringRelatedField(source='player', many=False)
    player = PlayerSerializer(write_only=True)
    team = TeamSerializer()
    
    class Meta:
        fields = (
            'id',
            'player_name',
            'player',
            'brand',
            'card_number',
            'set_name',
            'set_year',
            'team',
            'team_name',
            'front_of_card',
            'back_of_card'
        )
        read_only_fields = ('id',)
        model = Card
    
    def create(self, validated_data):
        with transaction.atomic():
            validated_team = validated_data.pop('team')
            team, _ = Team.objects.get_or_create(
                name = validated_team['name'],
                sport_id = validated_team['sport_id']
            )
            validated_player = validated_data.pop('player')
            player, _ = Player.objects.get_or_create(**validated_player)
            return Card.objects.create(team=team, player=player,**validated_data)
