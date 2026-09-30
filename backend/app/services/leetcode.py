import csv
import json
from datetime import date, datetime, timedelta, timezone
from io import StringIO
from typing import Any

import httpx

from app.config import get_leetcode_timeout
from app.schemas.calendar import (
    CalendarAnalyticsResponse,
    CalendarDay,
    CalendarDistributionItem,
    CalendarSummary,
)
from app.schemas.contests import (
    ContestAnalyticsResponse,
    ContestHistoryItem,
    ContestSummary,
)
from app.schemas.questions import (
    DifficultyCount,
    QuestionAnalyticsResponse,
    QuestionSummary,
    TopicCount,
)

LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

PROFILE_QUERY = """
query userPublicProfile($username: String!) {
  matchedUser(username: $username) {
    username
    githubUrl
    twitterUrl
    linkedinUrl
    profile {
      realName
      userAvatar
      ranking
      reputation
      countryName
      school
      company
      jobTitle
      aboutMe
    }
  }
}
"""

QUESTION_ANALYTICS_QUERY = """
query userQuestionAnalytics($username: String!, $userSlug: String!) {
    userProfileUserQuestionProgressV2(userSlug: $userSlug) {
        numAcceptedQuestions {
            difficulty
            count
        }
    }
    matchedUser(username: $username) {
        tagProblemCounts {
            fundamental {
                tagName
                tagSlug
                problemsSolved
            }
            intermediate {
                tagName
                tagSlug
                problemsSolved
            }
            advanced {
                tagName
                tagSlug
                problemsSolved
            }
        }
    }
}
"""

CONTEST_ANALYTICS_QUERY = """
query userContestAnalytics($username: String!) {
    userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        topPercentage
        badge {
            name
        }
    }
    userContestRankingHistory(username: $username) {
        attended
        trendDirection
        problemsSolved
        totalProblems
        rating
        ranking
        contest {
            title
            startTime
        }
    }
}
"""

CALENDAR_ANALYTICS_QUERY = """
query userSubmissionCalendar($username: String!) {
    matchedUser(username: $username) {
        userCalendar {
            submissionCalendar
        }
    }
}
"""


class LeetCodeAPIError(Exception):
    """Raised when LeetCode cannot provide a usable response."""


class LeetCodeUserNotFoundError(Exception):
    """Raised when LeetCode does not match a public username."""


class LeetCodeClient:
    def __init__(self, timeout: float | None = None) -> None:
        self.timeout = timeout or get_leetcode_timeout()

    def get_user_profile(self, username: str) -> dict[str, Any]:
        payload = {
            "query": PROFILE_QUERY,
            "variables": {"username": username},
        }

        try:
            response = httpx.post(
                LEETCODE_GRAPHQL_URL,
                json=payload,
                timeout=self.timeout,
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()
            result = response.json()
        except (httpx.HTTPError, ValueError) as error:
            raise LeetCodeAPIError("Unable to reach LeetCode profile service.") from error

        if result.get("errors"):
            raise LeetCodeAPIError("LeetCode profile service returned an error.")

        matched_user = result.get("data", {}).get("matchedUser")
        if matched_user is None:
            raise LeetCodeUserNotFoundError(username)

        return matched_user

    def get_question_analytics(self, username: str) -> QuestionAnalyticsResponse:
        payload = {
            "query": QUESTION_ANALYTICS_QUERY,
            "variables": {"username": username, "userSlug": username},
        }

        try:
            response = httpx.post(
                LEETCODE_GRAPHQL_URL,
                json=payload,
                timeout=self.timeout,
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()
            result = response.json()
        except (httpx.HTTPError, ValueError) as error:
            raise LeetCodeAPIError("Unable to reach LeetCode analytics service.") from error

        if result.get("errors"):
            raise LeetCodeAPIError("LeetCode analytics service returned an error.")

        data = result.get("data") or {}
        if data.get("matchedUser") is None:
            raise LeetCodeUserNotFoundError(username)

        progress = data.get("userProfileUserQuestionProgressV2") or {}
        accepted = progress.get("numAcceptedQuestions") or []
        difficulty_counts = {"Easy": 0, "Medium": 0, "Hard": 0}

        for item in accepted:
            difficulty = str(item.get("difficulty", "")).title()
            if difficulty in difficulty_counts:
                difficulty_counts[difficulty] = max(int(item.get("count", 0) or 0), 0)

        topics = []
        tag_problem_counts = data["matchedUser"].get("tagProblemCounts") or {}
        for category in ("fundamental", "intermediate", "advanced"):
            for topic in tag_problem_counts.get(category, []) or []:
                solved = max(int(topic.get("problemsSolved", 0) or 0), 0)
                if solved > 0:
                    topics.append(
                        TopicCount(
                            tag_name=topic.get("tagName") or "Unknown",
                            tag_slug=topic.get("tagSlug"),
                            problems_solved=solved,
                            category=category,
                        )
                    )

        topics.sort(key=lambda topic: topic.problems_solved, reverse=True)
        difficulty = [
            DifficultyCount(difficulty=label, count=count)
            for label, count in difficulty_counts.items()
        ]
        summary = QuestionSummary(
            total_solved=sum(difficulty_counts.values()),
            easy=difficulty_counts["Easy"],
            medium=difficulty_counts["Medium"],
            hard=difficulty_counts["Hard"],
        )

        return QuestionAnalyticsResponse(
            username=username,
            summary=summary,
            difficulty=difficulty,
            topics=topics,
        )

    def get_contest_analytics(self, username: str) -> ContestAnalyticsResponse:
        payload = {
            "query": CONTEST_ANALYTICS_QUERY,
            "variables": {"username": username},
        }

        try:
            response = httpx.post(
                LEETCODE_GRAPHQL_URL,
                json=payload,
                timeout=self.timeout,
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()
            result = response.json()
        except (httpx.HTTPError, ValueError) as error:
            raise LeetCodeAPIError("Unable to reach LeetCode contest service.") from error

        if result.get("errors"):
            raise LeetCodeAPIError("LeetCode contest service returned an error.")

        data = result.get("data") or {}
        if data.get("userContestRanking") is None and data.get("userContestRankingHistory") is None:
            raise LeetCodeUserNotFoundError(username)

        ranking = data.get("userContestRanking")
        summary = None
        if ranking is not None:
            summary = ContestSummary(
                rating=float(ranking.get("rating", 0) or 0),
                global_ranking=max(int(ranking.get("globalRanking", 0) or 0), 0),
                attended_contests=max(int(ranking.get("attendedContestsCount", 0) or 0), 0),
                top_percentage=float(ranking.get("topPercentage", 0) or 0),
                badge_name=(ranking.get("badge") or {}).get("name"),
            )

        history = []
        for contest in data.get("userContestRankingHistory") or []:
            if not contest.get("attended", True):
                continue

            contest_info = contest.get("contest") or {}
            history.append(
                ContestHistoryItem(
                    title=contest_info.get("title") or "Untitled contest",
                    start_time=int(contest_info.get("startTime", 0) or 0),
                    rating=float(contest.get("rating", 0) or 0),
                    ranking=max(int(contest.get("ranking", 0) or 0), 0),
                    problems_solved=max(int(contest.get("problemsSolved", 0) or 0), 0),
                    total_problems=max(int(contest.get("totalProblems", 0) or 0), 0),
                    trend_direction=contest.get("trendDirection") or "SAME",
                )
            )

        history.sort(key=lambda contest: contest.start_time)
        return ContestAnalyticsResponse(
            username=username,
            summary=summary,
            history=history,
        )

    def get_calendar_analytics(self, username: str) -> CalendarAnalyticsResponse:
        calendar_data = self._get_submission_calendar(username)
        return build_calendar_response(username, calendar_data)

    def get_calendar_csv(self, username: str) -> str:
        calendar_data = self._get_submission_calendar(username)
        calendar_response = build_calendar_response(username, calendar_data)
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(["Date", "Submissions", "Weekday"])
        for day in calendar_response.days:
            writer.writerow([day.date, day.count, day.weekday])
        return output.getvalue()

    def _get_submission_calendar(self, username: str) -> dict[str, int]:
        payload = {
            "query": CALENDAR_ANALYTICS_QUERY,
            "variables": {"username": username},
        }

        try:
            response = httpx.post(
                LEETCODE_GRAPHQL_URL,
                json=payload,
                timeout=self.timeout,
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()
            result = response.json()
        except (httpx.HTTPError, ValueError) as error:
            raise LeetCodeAPIError("Unable to reach LeetCode calendar service.") from error

        if result.get("errors"):
            raise LeetCodeAPIError("LeetCode calendar service returned an error.")

        matched_user = (result.get("data") or {}).get("matchedUser")
        if matched_user is None:
            raise LeetCodeUserNotFoundError(username)

        user_calendar = matched_user.get("userCalendar") or {}
        submission_calendar = user_calendar.get("submissionCalendar")
        if not submission_calendar:
            return {}

        if isinstance(submission_calendar, str):
            try:
                submission_calendar = json.loads(submission_calendar)
            except json.JSONDecodeError as error:
                raise LeetCodeAPIError("LeetCode returned an invalid submission calendar.") from error

        if not isinstance(submission_calendar, dict):
            raise LeetCodeAPIError("LeetCode returned an invalid submission calendar.")

        normalized = {}
        for timestamp, count in submission_calendar.items():
            try:
                normalized[str(int(timestamp))] = max(int(count or 0), 0)
            except (TypeError, ValueError):
                continue
        return normalized


def build_calendar_response(username: str, submission_calendar: dict[str, int]) -> CalendarAnalyticsResponse:
    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=364)
    counts_by_date: dict[date, int] = {}

    for timestamp, count in submission_calendar.items():
        submitted_date = datetime.fromtimestamp(int(timestamp), tz=timezone.utc).date()
        if start_date <= submitted_date <= end_date:
            counts_by_date[submitted_date] = counts_by_date.get(submitted_date, 0) + count

    days = []
    for offset in range(365):
        current_date = start_date + timedelta(days=offset)
        days.append(
            CalendarDay(
                date=current_date.isoformat(),
                count=counts_by_date.get(current_date, 0),
                weekday=current_date.strftime("%A"),
                week_index=(offset + start_date.weekday()) // 7,
                month=current_date.strftime("%b"),
            )
        )

    total_submissions = sum(day.count for day in days)
    active_days = [day for day in days if day.count > 0]
    weekday_totals: dict[str, int] = {}
    for day in days:
        weekday_totals[day.weekday] = weekday_totals.get(day.weekday, 0) + day.count

    most_productive_weekday = None
    if total_submissions:
        most_productive_weekday = max(weekday_totals, key=weekday_totals.get)

    distribution_ranges = (("0", 0, 0), ("1-2", 1, 2), ("3-5", 3, 5), ("6-10", 6, 10), ("11+", 11, None))
    distribution = []
    for bucket, minimum, maximum in distribution_ranges:
        matching_days = [
            day for day in days
            if day.count >= minimum and (maximum is None or day.count <= maximum)
        ]
        distribution.append(CalendarDistributionItem(bucket=bucket, days=len(matching_days)))

    return CalendarAnalyticsResponse(
        username=username,
        summary=CalendarSummary(
            submission_days=len(active_days),
            highest_daily_count=max((day.count for day in days), default=0),
            average_per_day=round(total_submissions / len(days), 1),
            total_submissions=total_submissions,
            most_productive_weekday=most_productive_weekday,
        ),
        days=days,
        distribution=distribution,
    )
