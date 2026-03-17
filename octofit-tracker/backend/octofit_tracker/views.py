from rest_framework import viewsets

from octofit_tracker.models import (
    Activity,
    FitnessUser,
    LeaderboardEntry,
    Team,
    Workout,
)
from octofit_tracker.serializers import (
    ActivitySerializer,
    LeaderboardEntrySerializer,
    TeamSerializer,
    UserSerializer,
    WorkoutSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = FitnessUser.objects.all()
    serializer_class = UserSerializer
    filterset_fields = ['team_name', 'universe']
    search_fields = ['full_name', 'hero_alias', 'email']
    ordering_fields = ['full_name', 'total_points', 'weekly_goal']


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    filterset_fields = ['universe']
    search_fields = ['name', 'captain']
    ordering_fields = ['name', 'total_points', 'member_count']


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    filterset_fields = ['user_email', 'team_name', 'activity_type']
    search_fields = ['user_alias', 'activity_type']
    ordering_fields = ['performed_at', 'duration_minutes', 'calories_burned']


class LeaderboardEntryViewSet(viewsets.ModelViewSet):
    queryset = LeaderboardEntry.objects.all()
    serializer_class = LeaderboardEntrySerializer
    filterset_fields = ['category', 'team_name']
    search_fields = ['display_name']
    ordering_fields = ['rank', 'score', 'recorded_on']


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    filterset_fields = ['difficulty', 'coach_name']
    search_fields = ['title', 'focus_area', 'recommended_for']
    ordering_fields = ['title', 'duration_minutes']
