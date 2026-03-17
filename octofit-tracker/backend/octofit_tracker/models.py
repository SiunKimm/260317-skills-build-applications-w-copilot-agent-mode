from django.db import models


class FitnessUser(models.Model):
    full_name = models.CharField(max_length=100)
    hero_alias = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    team_name = models.CharField(max_length=50)
    universe = models.CharField(max_length=20)
    weekly_goal = models.PositiveIntegerField(default=150)
    total_points = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'users'
        ordering = ['full_name']
        indexes = [models.Index(fields=['email']), models.Index(fields=['team_name'])]

    def __str__(self):
        return self.hero_alias


class Team(models.Model):
    name = models.CharField(max_length=50, unique=True)
    universe = models.CharField(max_length=20)
    motto = models.CharField(max_length=200)
    captain = models.CharField(max_length=100)
    member_count = models.PositiveIntegerField(default=0)
    total_points = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'teams'
        ordering = ['name']

    def __str__(self):
        return self.name


class Activity(models.Model):
    user_email = models.EmailField()
    user_alias = models.CharField(max_length=100)
    team_name = models.CharField(max_length=50)
    activity_type = models.CharField(max_length=50)
    duration_minutes = models.PositiveIntegerField()
    calories_burned = models.PositiveIntegerField()
    performed_at = models.DateTimeField()

    class Meta:
        db_table = 'activities'
        ordering = ['-performed_at']
        indexes = [models.Index(fields=['user_email']), models.Index(fields=['team_name'])]

    def __str__(self):
        return f'{self.user_alias} - {self.activity_type}'


class LeaderboardEntry(models.Model):
    rank = models.PositiveIntegerField()
    category = models.CharField(max_length=50)
    display_name = models.CharField(max_length=100)
    team_name = models.CharField(max_length=50)
    score = models.PositiveIntegerField()
    recorded_on = models.DateField()

    class Meta:
        db_table = 'leaderboard'
        ordering = ['category', 'rank']
        constraints = [
            models.UniqueConstraint(
                fields=['category', 'rank', 'display_name'],
                name='unique_leaderboard_entry',
            )
        ]

    def __str__(self):
        return f'{self.rank} - {self.display_name}'


class Workout(models.Model):
    title = models.CharField(max_length=100)
    focus_area = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=20)
    coach_name = models.CharField(max_length=100)
    duration_minutes = models.PositiveIntegerField()
    recommended_for = models.CharField(max_length=100)

    class Meta:
        db_table = 'workouts'
        ordering = ['title']

    def __str__(self):
        return self.title
