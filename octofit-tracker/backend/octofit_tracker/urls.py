"""URL configuration for the octofit_tracker project."""

import os

from django.contrib import admin
from django.urls import include, path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter

from octofit_tracker.views import (
    ActivityViewSet,
    LeaderboardEntryViewSet,
    TeamViewSet,
    UserViewSet,
    WorkoutViewSet,
)

codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    base_url = 'http://localhost:8000'

router = DefaultRouter(trailing_slash=True)
router.register('users', UserViewSet, basename='user')
router.register('teams', TeamViewSet, basename='team')
router.register('activities', ActivityViewSet, basename='activity')
router.register('leaderboard', LeaderboardEntryViewSet, basename='leaderboard')
router.register('workouts', WorkoutViewSet, basename='workout')


@api_view(['GET'])
def api_root(request):
    return Response(
        {
            'message': 'OctoFit Tracker API',
            'admin': f'{base_url}/admin/',
            'users': f'{base_url}/api/users/',
            'teams': f'{base_url}/api/teams/',
            'activities': f'{base_url}/api/activities/',
            'leaderboard': f'{base_url}/api/leaderboard/',
            'workouts': f'{base_url}/api/workouts/',
            'collections': ['users', 'teams', 'activities', 'leaderboard', 'workouts'],
        }
    )

urlpatterns = [
    path('', api_root, name='root-api'),
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
