from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Playbook
from .serializers import PlaybookSerializer

class PlaybookViewSet(viewsets.ModelViewSet):
    serializer_class = PlaybookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.playbooks.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
