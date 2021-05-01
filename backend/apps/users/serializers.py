from rest_framework import serializers
from .models import User


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'pk',
            'username',
            'email',
            'first_name',
            'last_name'
        )
        read_only_fields = ('pk',)

    def update(self, instance, validated_data):
        instance.email = validated_data['email']
        instance.first_name = validated_data['first_name']
        instance.last_name = validated_data['last_name']
        instance.save()
        return instance
