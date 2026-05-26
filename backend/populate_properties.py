import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'firstbuy.settings')
django.setup()

from properties.models import Property
from accounts.models import CustomUser
from decimal import Decimal

def run():
    # Make sure we have a builder
    builder, _ = CustomUser.objects.get_or_create(
        email='builder@firstbuy.com',
        defaults={
            'full_name': 'Avasa Developers',
            'role': 'builder',
            'is_active': True,
        }
    )
    if not builder.password:
        builder.set_password('builderpassword123')
        builder.save()

    print("Checking properties...")
    if Property.objects.count() == 0:
        Property.objects.create(
            builder=builder,
            title='Skyline Residences',
            description='A beautiful luxury launch.',
            price_in_inr=Decimal('18500000'), # 1.85 Cr
            location='Gurgaon, Sector 65',
            trust_score=96,
            max_credit_discount_allowed=Decimal('420000') # 4.2L
        )
        Property.objects.create(
            builder=builder,
            title='Azure Villa Estate',
            description='Premium villas in Bengaluru.',
            price_in_inr=Decimal('34000000'), # 3.40 Cr
            location='Whitefield, Bengaluru',
            trust_score=98,
            max_credit_discount_allowed=Decimal('680000') # 6.8L
        )
        Property.objects.create(
            builder=builder,
            title='Altura Sky Penthouse',
            description='A featured penthouse in Mumbai.',
            price_in_inr=Decimal('62000000'), # 6.20 Cr
            location='Lower Parel, Mumbai',
            trust_score=99,
            max_credit_discount_allowed=Decimal('1200000') # 12L
        )
        print("✅ Added 3 mockup properties to the database!")
    else:
        print("Properties already exist in DB.")

if __name__ == '__main__':
    run()
