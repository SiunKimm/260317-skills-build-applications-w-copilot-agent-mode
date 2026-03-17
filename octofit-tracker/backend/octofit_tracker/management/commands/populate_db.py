from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from octofit_tracker.models import (
    Activity,
    FitnessUser,
    LeaderboardEntry,
    Team,
    Workout,
)


class Command(BaseCommand):
    help = 'octofit_db 데이터베이스에 테스트 데이터를 입력합니다.'

    def handle(self, *args, **options):
        Activity.objects.all().delete()
        LeaderboardEntry.objects.all().delete()
        Workout.objects.all().delete()
        FitnessUser.objects.all().delete()
        Team.objects.all().delete()

        teams = [
            Team(
                name='marvel team',
                universe='Marvel',
                motto='Stronger together across the multiverse.',
                captain='Captain Marvel',
                member_count=3,
                total_points=1290,
            ),
            Team(
                name='dc team',
                universe='DC',
                motto='Train hard, protect harder.',
                captain='Wonder Woman',
                member_count=3,
                total_points=1215,
            ),
        ]
        Team.objects.bulk_create(teams)

        users = [
            FitnessUser(
                full_name='Peter Parker',
                hero_alias='Spider-Man',
                email='spiderman@octofit.dev',
                team_name='marvel team',
                universe='Marvel',
                weekly_goal=180,
                total_points=430,
            ),
            FitnessUser(
                full_name='Carol Danvers',
                hero_alias='Captain Marvel',
                email='captainmarvel@octofit.dev',
                team_name='marvel team',
                universe='Marvel',
                weekly_goal=210,
                total_points=460,
            ),
            FitnessUser(
                full_name='TChalla',
                hero_alias='Black Panther',
                email='blackpanther@octofit.dev',
                team_name='marvel team',
                universe='Marvel',
                weekly_goal=190,
                total_points=400,
            ),
            FitnessUser(
                full_name='Diana Prince',
                hero_alias='Wonder Woman',
                email='wonderwoman@octofit.dev',
                team_name='dc team',
                universe='DC',
                weekly_goal=220,
                total_points=455,
            ),
            FitnessUser(
                full_name='Barry Allen',
                hero_alias='The Flash',
                email='theflash@octofit.dev',
                team_name='dc team',
                universe='DC',
                weekly_goal=240,
                total_points=395,
            ),
            FitnessUser(
                full_name='Bruce Wayne',
                hero_alias='Batman',
                email='batman@octofit.dev',
                team_name='dc team',
                universe='DC',
                weekly_goal=200,
                total_points=365,
            ),
        ]
        FitnessUser.objects.bulk_create(users)

        now = timezone.now()
        activities = [
            Activity(
                user_email='spiderman@octofit.dev',
                user_alias='Spider-Man',
                team_name='marvel team',
                activity_type='Wall Climb Intervals',
                duration_minutes=45,
                calories_burned=510,
                performed_at=now - timedelta(days=1),
            ),
            Activity(
                user_email='captainmarvel@octofit.dev',
                user_alias='Captain Marvel',
                team_name='marvel team',
                activity_type='Flight Core Circuit',
                duration_minutes=50,
                calories_burned=560,
                performed_at=now - timedelta(days=2),
            ),
            Activity(
                user_email='blackpanther@octofit.dev',
                user_alias='Black Panther',
                team_name='marvel team',
                activity_type='Vibranium Sprint Set',
                duration_minutes=40,
                calories_burned=470,
                performed_at=now - timedelta(days=3),
            ),
            Activity(
                user_email='wonderwoman@octofit.dev',
                user_alias='Wonder Woman',
                team_name='dc team',
                activity_type='Amazon Strength Session',
                duration_minutes=55,
                calories_burned=580,
                performed_at=now - timedelta(days=1),
            ),
            Activity(
                user_email='theflash@octofit.dev',
                user_alias='The Flash',
                team_name='dc team',
                activity_type='Speed Force Tempo Run',
                duration_minutes=35,
                calories_burned=490,
                performed_at=now - timedelta(days=2),
            ),
            Activity(
                user_email='batman@octofit.dev',
                user_alias='Batman',
                team_name='dc team',
                activity_type='Gotham Night HIIT',
                duration_minutes=48,
                calories_burned=530,
                performed_at=now - timedelta(days=4),
            ),
        ]
        Activity.objects.bulk_create(activities)

        leaderboard_entries = [
            LeaderboardEntry(
                rank=1,
                category='individual',
                display_name='Captain Marvel',
                team_name='marvel team',
                score=460,
                recorded_on=date.today(),
            ),
            LeaderboardEntry(
                rank=2,
                category='individual',
                display_name='Wonder Woman',
                team_name='dc team',
                score=455,
                recorded_on=date.today(),
            ),
            LeaderboardEntry(
                rank=3,
                category='individual',
                display_name='Spider-Man',
                team_name='marvel team',
                score=430,
                recorded_on=date.today(),
            ),
            LeaderboardEntry(
                rank=1,
                category='team',
                display_name='marvel team',
                team_name='marvel team',
                score=1290,
                recorded_on=date.today(),
            ),
            LeaderboardEntry(
                rank=2,
                category='team',
                display_name='dc team',
                team_name='dc team',
                score=1215,
                recorded_on=date.today(),
            ),
        ]
        LeaderboardEntry.objects.bulk_create(leaderboard_entries)

        workouts = [
            Workout(
                title='Spider Agility Flow',
                focus_area='Mobility and agility',
                difficulty='Intermediate',
                coach_name='Spider-Man',
                duration_minutes=30,
                recommended_for='Quick reflex development',
            ),
            Workout(
                title='Binary Burst Strength',
                focus_area='Full-body power',
                difficulty='Advanced',
                coach_name='Captain Marvel',
                duration_minutes=40,
                recommended_for='Explosive strength days',
            ),
            Workout(
                title='Amazon Warrior Circuit',
                focus_area='Strength and endurance',
                difficulty='Advanced',
                coach_name='Wonder Woman',
                duration_minutes=45,
                recommended_for='Competition preparation',
            ),
            Workout(
                title='Knight Tactical Conditioning',
                focus_area='Core and stamina',
                difficulty='Intermediate',
                coach_name='Batman',
                duration_minutes=35,
                recommended_for='Balanced conditioning',
            ),
        ]
        Workout.objects.bulk_create(workouts)

        self.stdout.write(self.style.SUCCESS('octofit_db 테스트 데이터 적재가 완료되었습니다.'))