import os
import hashlib
import jwt
from datetime import datetime, timedelta
from typing import Optional

SECRET_KEY = "mindharmonics_secret_key_jwt_super_secure_token"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

def hash_password(password: str) -> str:
    """Hashes password using PBKDF2 HMAC SHA256 with random 16-byte salt."""
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return f"{salt.hex()}:{key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies plain password against stored salt:key hash."""
    try:
        if ":" not in hashed_password:
            return False
        salt_hex, key_hex = hashed_password.split(":", 1)
        salt = bytes.fromhex(salt_hex)
        expected_key = bytes.fromhex(key_hex)
        derived_key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
        return hashlib.sha256(derived_key).digest() == hashlib.sha256(expected_key).digest()
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def create_access_token(user_id: str, email: str) -> str:
    """Generates signed JWT access token."""
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    """Decodes JWT access token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None
