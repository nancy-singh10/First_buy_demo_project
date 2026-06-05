import os
import django
import sys
from decimal import Decimal

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'firstbuy.settings')
django.setup()

from properties.models import Property
from accounts.models import CustomUser

def run():
    builder, _ = CustomUser.objects.get_or_create(
        email='builder@firstbuy.com',
        defaults={
            'full_name': 'Avasa Developers',
            'role': 'builder',
            'is_active': True,
        }
    )

    new_properties = [
        {
            'title': 'Green Valley Apartments',
            'description': 'Eco-friendly smart homes in a lush green environment.',
            'price_in_inr': Decimal('12000000'), # 1.2 Cr
            'location': 'Wakad, Pune',
            'trust_score': 94,
            'max_credit_discount_allowed': Decimal('250000') # 2.5L
        },
        {
            'title': 'The Sovereign Tower',
            'description': 'Ultra luxury 5 BHK apartments with sea view.',
            'price_in_inr': Decimal('85000000'), # 8.5 Cr
            'location': 'Bandra West, Mumbai',
            'trust_score': 99,
            'max_credit_discount_allowed': Decimal('1500000') # 15L
        },
        {
            'title': 'Oasis Tech Park Residences',
            'description': 'Walk to work. Modern apartments designed for IT professionals.',
            'price_in_inr': Decimal('21000000'), # 2.1 Cr
            'location': 'HITEC City, Hyderabad',
            'trust_score': 97,
            'max_credit_discount_allowed': Decimal('500000') # 5L
        },
        {
            'title': 'Imperial Gardens',
            'description': 'Spacious 3 BHK flats with world class amenities.',
            'price_in_inr': Decimal('16500000'), # 1.65 Cr
            'location': 'Noida Sector 150',
            'trust_score': 95,
            'max_credit_discount_allowed': Decimal('350000') # 3.5L
        },
        {
            'title': 'Riverside Retreat',
            'description': 'Calm and serene environment facing the river.',
            'price_in_inr': Decimal('42000000'), # 4.2 Cr
            'location': 'Rajarhat, Kolkata',
            'trust_score': 93,
            'max_credit_discount_allowed': Decimal('800000') # 8L
        }
    ]

    added = 0
    for p in new_properties:
        # Avoid duplicates based on title
        if not Property.objects.filter(title=p['title']).exists():
            Property.objects.create(
                builder=builder,
                title=p['title'],
                description=p['description'],
                price_in_inr=p['price_in_inr'],
                location=p['location'],
                trust_score=p['trust_score'],
                max_credit_discount_allowed=p['max_credit_discount_allowed']
            )
            added += 1

    print(f"Added {added} more mockup properties to the database!")

if __name__ == '__main__':
    run()
