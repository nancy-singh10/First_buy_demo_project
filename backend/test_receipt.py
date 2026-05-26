import requests
import sys

def main():
    # Login to get token
    login_resp = requests.post('http://127.0.0.1:8000/api/auth/login/', json={
        'email': 'nancy@firstbuy.com',
        'password': 'password123'
    })
    token = login_resp.json().get('access')
    if not token:
        print("Login failed", login_resp.text)
        return
    
    # Upload receipt
    files = {'receipt_image': ('test.png', b'dummy content', 'image/png')}
    data = {'store_name': 'Test Store', 'amount_spent': 100}
    
    resp = requests.post(
        'http://127.0.0.1:8000/api/receipts/',
        headers={'Authorization': f'Bearer {token}'},
        data=data,
        files=files
    )
    print(resp.status_code)
    print(resp.text)

if __name__ == '__main__':
    main()
