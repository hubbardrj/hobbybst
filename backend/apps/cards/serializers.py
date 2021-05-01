# todos/serializers.py
from django.db import transaction
from django.db import IntegrityError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from ..sportdata.serializers import PlayerSerializer, TeamSerializer
from ..sportdata.models import Player, Team
from .models import Card, Brand, Checklist, ChecklistCard

import json

class BulkCreateListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        result = [self.child.create(attrs) for attrs in validated_data]

        try:
            self.child.Meta.model.objects.bulk_create(result)
        except IntegrityError as e:
            raise ValidationError(e)

        return result

class BrandSerializer(serializers.ModelSerializer):
    sport_id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Brand
        fields = (
            'id',
            'name',
            'sport_id'
        )
        read_only_fields = ('id','name','sport_id')

class CardSerializer(serializers.ModelSerializer):
    team_name = serializers.StringRelatedField(source='team', many=False)
    brand = serializers.StringRelatedField(many=False)
    player_name = serializers.StringRelatedField(source='player', many=False)
    player = PlayerSerializer()
    team = TeamSerializer()
    brand = BrandSerializer(read_only=True)
    brand_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        fields = (
            'id',
            'player_name',
            'player',
            'brand',
            'brand_id',
            'card_number',
            'notes',
            'set_name',
            'set_year',
            'seq',
            'team',
            'team_name',
            'front_of_card',
            'back_of_card'
        )
        read_only_fields = ('id',)
        model = Card
        list_serializer_class = BulkCreateListSerializer
    
    def create(self, validated_data):

        with transaction.atomic():
            print(validated_data)
            validated_team = validated_data.pop('team')
            team, _ = Team.objects.get_or_create(
                name = validated_team['name'],
                sport_id = validated_team['sport_id']
            )
            validated_player = validated_data.pop('player')
            player, _ = Player.objects.get_or_create(
                full_name = validated_player['full_name'],
                sport_id = validated_player['sport_id'])

            
            instance = Card(team=team, player=player, **validated_data)
            ##return Card.objects.create(team=team, player=player,**validated_data)
            if isinstance(self._kwargs["data"], dict):
                instance.save()

            return instance

    def update(self, instance, validated_data):
        with transaction.atomic():
            validated_team = validated_data.pop('team')
            team, _ = Team.objects.get_or_create(
                name = validated_team['name'],
                sport_id = validated_team['sport_id']
            )
            validated_player = validated_data.pop('player')
            player, _ = Player.objects.get_or_create(
                full_name = validated_player['full_name'],
                sport_id = validated_player['sport_id'])

            instance.seq = validated_data['seq']
            instance.notes = validated_data['notes']
            instance.player = player
            instance.team = team
            instance.save()
            return instance

class ChecklistCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistCard
        fields = (
            'id',
            'set_name',
            'player_name',
            'card_number',
            'team_name',
            'seq',
            'other',
        )

class ChecklistSerializer(serializers.ModelSerializer):
    cards = ChecklistCardSerializer(many=True, read_only=True, source='checklist')
    
    class Meta:
        model = Checklist
        fields = (
            'brand',
            'year',
            'cards',
        )
