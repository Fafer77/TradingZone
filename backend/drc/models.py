import uuid
from django.db import models
from django.contrib.auth.models import User

class DailyReportCard(models.Model):
    GRADE_CHOICES = [
        ('A+', 'A+'),
        ('A', 'A'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B', 'B'),
        ('B-', 'B-'),
        ('C+', 'C+'),
        ('C', 'C'),
        ('C-', 'C-'),
        ('D+', 'D+'),
        ('D', 'D'),
        ('D-', 'D-'),
        ('F', 'F'),
        ('N/A', 'N/A')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField()

    grade = models.CharField(
        max_length=3,
        choices=GRADE_CHOICES,
        default='C'
    )

    goal = models.TextField(blank=True)
    pnl = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    reminders = models.JSONField(default=list, blank=True)
    improvements = models.JSONField(default=list, blank=True)
    mistakes_with_solutions = models.JSONField(default=list, blank=True)

    performance_table = models.JSONField(default=list, blank=True)
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_report_cards')

    class Meta:
        ordering = ['-date']
        unique_together = ['owner', 'date']

    def __str__(self):
        return f'DRC on {self.date} for {self.owner} with grade {self.grade}.'
