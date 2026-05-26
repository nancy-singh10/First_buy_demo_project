import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'firstbuy.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
email = 'admin@firstbuy.com'
password = 'adminpassword123'

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(email=email, password=password)
    print(f"Admin user {email} created successfully.")
else:
    user = User.objects.get(email=email)
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f"Admin user {email} password reset and permissions updated.")
