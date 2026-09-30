from fastapi import APIRouter, HTTPException, Path, status

from app.schemas.contests import ContestAnalyticsResponse
from app.services.leetcode import (
    LeetCodeAPIError,
    LeetCodeClient,
    LeetCodeUserNotFoundError,
)

router = APIRouter(prefix="/api/contests", tags=["contests"])


@router.get(
    "/{username}",
    response_model=ContestAnalyticsResponse,
    responses={
        404: {"description": "LeetCode username was not found."},
        502: {"description": "LeetCode contest service failed."},
    },
)
def get_contests(
    username: str = Path(min_length=1, max_length=39),
) -> ContestAnalyticsResponse:
    normalized_username = username.strip()
    if not normalized_username:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Username must not be empty.",
        )

    try:
        return LeetCodeClient().get_contest_analytics(normalized_username)
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
