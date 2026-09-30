from pydantic import BaseModel, ConfigDict


class CalendarDay(BaseModel):
    model_config = ConfigDict(extra="forbid")

    date: str
    count: int
    weekday: str
    week_index: int
    month: str


class CalendarDistributionItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    bucket: str
    days: int


class CalendarSummary(BaseModel):
    model_config = ConfigDict(extra="forbid")

    submission_days: int
    highest_daily_count: int
    average_per_day: float
    total_submissions: int
    most_productive_weekday: str | None = None


class CalendarAnalyticsResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    username: str
    summary: CalendarSummary
    days: list[CalendarDay]
    distribution: list[CalendarDistributionItem]
