from rest_framework import serializers

from octofit_tracker.models import (
    Activity,
    FitnessUser,
    LeaderboardEntry,
    Team,
    Workout,
)


class ObjectIdStringModelSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for key, value in data.items():
            if value is not None and value.__class__.__name__ == 'ObjectId':
                data[key] = str(value)
        return data


class UserSerializer(ObjectIdStringModelSerializer):
    class Meta:
        model = FitnessUser
        fields = '__all__'
        read_only_fields = ['id']


class TeamSerializer(ObjectIdStringModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ['id']


class ActivitySerializer(ObjectIdStringModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ['id']


class LeaderboardEntrySerializer(ObjectIdStringModelSerializer):
    class Meta:
        model = LeaderboardEntry
        fields = '__all__'
        read_only_fields = ['id']


class WorkoutSerializer(ObjectIdStringModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'
        read_only_fields = ['id']
