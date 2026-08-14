import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import AsyncSessionLocal
from app.schemas.user import UserSignUp, UserLogin
from app.api.endpoints.auth import signup, login

async def main():
    print("Testing Auth Endpoints...")
    async with AsyncSessionLocal() as session:
        # Test Signup
        try:
            res = await signup(UserSignUp(email="testuser@example.com", password="password123", full_name="MindHarmonics Listener"), session)
            print(f"SUCCESS: Signed up user '{res.user.email}' (ID: {res.user.id})")
            print(f"JWT Access Token: {res.access_token[:30]}...")
        except Exception as e:
            print(f"Signup note (user might already exist): {e}")

        # Test Login
        res_login = await login(UserLogin(email="testuser@example.com", password="password123"), session)
        print(f"SUCCESS: Logged in user '{res_login.user.email}'")
        print(f"Login JWT Token: {res_login.access_token[:30]}...")

if __name__ == "__main__":
    asyncio.run(main())
