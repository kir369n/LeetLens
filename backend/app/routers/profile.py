from fastapi import APIRouter, HTTPException, Path, status

from app.schemas.profile import ProfileDetails, SocialLinks, UserProfileResponse
from app.services.leetcode import (
    LeetCodeAPIError,
    LeetCodeClient,
    LeetCodeUserNotFoundError,
)

router = APIRouter(prefix="/api/profile", tags=["profile"])


def normalize_profile(matched_user: dict) -> UserProfileResponse:
    profile = matched_user.get("profile") or {}

    return UserProfileResponse(
        username=matched_user["username"],
        profile=ProfileDetails(
            real_name=profile.get("realName"),
            avatar_url=profile.get("userAvatar"),
            ranking=profile.get("ranking"),
            reputation=profile.get("reputation"),
            country=profile.get("countryName"),
            school=profile.get("school"),
            company=profile.get("company"),
            job_title=profile.get("jobTitle"),
            bio=profile.get("aboutMe"),
        ),
        social=SocialLinks(
            github=matched_user.get("githubUrl"),
            linkedin=matched_user.get("linkedinUrl"),
            twitter=matched_user.get("twitterUrl"),
        ),
    )


@router.get(
    "/{username}",
    response_model=UserProfileResponse,
    responses={
        404: {"description": "LeetCode username was not found."},
        502: {"description": "LeetCode profile service failed."},
    },
)
def get_profile(
    username: str = Path(min_length=1, max_length=39),
) -> UserProfileResponse:
    normalized_username = username.strip()
    if not normalized_username:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Username must not be empty.",
        )

    try:
        matched_user = LeetCodeClient().get_user_profile(normalized_username)
    except LeetCodeUserNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"LeetCode user '{normalized_username}' was not found.",
        ) from error
    except LeetCodeAPIError as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(error),
        ) from error

    return normalize_profile(matched_user)
