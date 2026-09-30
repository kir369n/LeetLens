from fastapi import APIRouter, HTTPException, Path, status
from fastapi.responses import Response

from app.services.leetcode import (
    LeetCodeAPIError,
    LeetCodeClient,
    LeetCodeUserNotFoundError,
)
from app.schemas.calendar import CalendarAnalyticsResponse

router = APIRouter(tags=["calendar"])


@router.get(
    "/api/calendar/{username}",
    response_model=CalendarAnalyticsResponse,
    responses={
        404: {"description": "LeetCode username was not found."},
        502: {"description": "LeetCode calendar service failed."},
    },
)
def get_calendar(
    username: str = Path(min_length=1, max_length=39),
) -> CalendarAnalyticsResponse:
    normalized_username = username.strip()
    if not normalized_username:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Username must not be empty.",
        )

    try:
        return LeetCodeClient().get_calendar_analytics(normalized_username)
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


@router.get(
    "/api/reports/{username}/csv",
    responses={
        404: {"description": "LeetCode username was not found."},
        502: {"description": "LeetCode calendar service failed."},
    },
)
def download_calendar_csv(
    username: str = Path(min_length=1, max_length=39),
) -> Response:
    normalized_username = username.strip()
    if not normalized_username:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Username must not be empty.",
        )

    try:
        csv_content = LeetCodeClient().get_calendar_csv(normalized_username)
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

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="{normalized_username}-submission-history.csv"',
        },
    )
