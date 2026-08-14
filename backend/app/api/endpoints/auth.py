import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserSignUp, UserLogin, UserResponse, AuthTokenResponse
from app.core.security import hash_password, verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/signup", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserSignUp, db: AsyncSession = Depends(get_db)):
    """Sign up new user via email and password."""
    email_clean = payload.email.lower().strip()
    
    # Check if email exists
    result = await db.execute(select(User).where(User.email == email_clean))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user_id = str(uuid.uuid4())
    user = User(
        id=user_id,
        email=email_clean,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token(user_id=user.id, email=user.email)
    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user
    )

@router.post("/login", response_model=AuthTokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    """Log in existing user via email and password."""
    email_clean = payload.email.lower().strip()
    
    result = await db.execute(select(User).where(User.email == email_clean))
    user = result.scalar_one_or_none()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password."
        )

    token = create_access_token(user_id=user.id, email=user.email)
    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return current_user
