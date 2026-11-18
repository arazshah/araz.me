import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create the initial admin (username 'admin') if no superuser exists."

    def handle(self, *a, **kw):
        User = get_user_model()
        if User.objects.filter(is_superuser=True).exists():
            return
        pw = os.environ.get("INITIAL_ADMIN_PASSWORD", "Araz@Change-Me-2026")
        User.objects.create_superuser("admin", os.environ.get("INITIAL_ADMIN_EMAIL", "mail@araz.me"), pw)
        self.stdout.write(self.style.WARNING("Created superuser 'admin' with the INITIAL password — change it after first login."))
