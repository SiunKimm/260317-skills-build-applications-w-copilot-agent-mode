from datetime import date

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

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


class OctoFitCollectionTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        FitnessUser.objects.create(
            full_name='Peter Parker',
            hero_alias='Spider-Man',
            email='spiderman@test.dev',
            team_name='marvel team',
            universe='Marvel',
            weekly_goal=180,
            total_points=430,
        )
        Team.objects.create(
            name='marvel team',
            universe='Marvel',
            motto='Friendly neighborhood fitness.',
            captain='Captain Marvel',
            member_count=3,
            total_points=1290,
        )
        Activity.objects.create(
            user_email='spiderman@test.dev',
            user_alias='Spider-Man',
            team_name='marvel team',
            activity_type='Wall Climb Intervals',
            duration_minutes=45,
            calories_burned=510,
            performed_at=timezone.now(),
        )
        LeaderboardEntry.objects.create(
            rank=1,
            category='individual',
            display_name='Spider-Man',
            team_name='marvel team',
            score=430,
            recorded_on=date.today(),
        )
        Workout.objects.create(
            title='Spider Agility Flow',
            focus_area='Mobility',
            difficulty='Intermediate',
            coach_name='Spider-Man',
            duration_minutes=30,
            recommended_for='Agility days',
        )

    def test_models_use_expected_collection_names(self):
        self.assertEqual(FitnessUser._meta.db_table, 'users')
        self.assertEqual(Team._meta.db_table, 'teams')
        self.assertEqual(Activity._meta.db_table, 'activities')
        self.assertEqual(LeaderboardEntry._meta.db_table, 'leaderboard')
        self.assertEqual(Workout._meta.db_table, 'workouts')

    def test_serializers_cover_all_collections(self):
        self.assertIn('email', UserSerializer(FitnessUser.objects.first()).data)
        self.assertIn('captain', TeamSerializer(Team.objects.first()).data)
        self.assertIn('activity_type', ActivitySerializer(Activity.objects.first()).data)
        self.assertIn(
            'score',
            LeaderboardEntrySerializer(LeaderboardEntry.objects.first()).data,
        )
        self.assertIn('difficulty', WorkoutSerializer(Workout.objects.first()).data)

    def test_api_root_lists_supported_collections(self):
        response = self.client.get('/api/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()['collections'],
            ['users', 'teams', 'activities', 'leaderboard', 'workouts'],
        )

    def test_collection_endpoints_respond(self):
        endpoints = [
            '/api/users/',
            '/api/teams/',
            '/api/activities/',
            '/api/leaderboard/',
            '/api/workouts/',
        ]

        for endpoint in endpoints:
            with self.subTest(endpoint=endpoint):
                response = self.client.get(endpoint)
                self.assertEqual(response.status_code, 200)
                self.assertGreaterEqual(len(response.json()), 1)