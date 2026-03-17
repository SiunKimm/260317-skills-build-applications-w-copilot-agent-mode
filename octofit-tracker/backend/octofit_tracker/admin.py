from django.contrib import admin

from octofit_tracker.models import (
    Activity,
    FitnessUser,
    LeaderboardEntry,
    Team,
    Workout,
)


@admin.register(FitnessUser)
class FitnessUserAdmin(admin.ModelAdmin):
    list_display = ['hero_alias', 'full_name', 'email', 'team_name', 'total_points']
    search_fields = ['hero_alias', 'full_name', 'email']
    list_filter = ['team_name', 'universe']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'universe', 'captain', 'member_count', 'total_points']
    search_fields = ['name', 'captain']
    list_filter = ['universe']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['user_alias', 'activity_type', 'team_name', 'duration_minutes', 'performed_at']
    search_fields = ['user_alias', 'activity_type', 'user_email']
    list_filter = ['team_name', 'activity_type']


@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    list_display = ['category', 'rank', 'display_name', 'team_name', 'score']
    search_fields = ['display_name', 'team_name']
    list_filter = ['category', 'team_name']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['title', 'focus_area', 'difficulty', 'coach_name', 'duration_minutes']
    search_fields = ['title', 'focus_area', 'coach_name']
    list_filter = ['difficulty', 'coach_name']

