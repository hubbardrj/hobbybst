from rest_framework import serializers
from .models import Sport, Player, Team


class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = (
            'id',
            'name',
            'abbr',
        )
        read_only_fields = ('id','name','abbr')

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = (
            'id',
            'full_name',
        )
        read_only_fields = ('id',)

class TeamSerializer(serializers.ModelSerializer):
    sport = serializers.StringRelatedField(many=False)
    sport_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Team
        fields = (
            'id',
            'name',
            'sport',
            'sport_id'
        )
        read_only_fields = ('id',)