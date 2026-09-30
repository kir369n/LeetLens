from pydantic import BaseModel, ConfigDict


class ContestSummary(BaseModel):
    model_config = ConfigDict(extra="forbid")

    rating: float
    global_ranking: int
    attended_contests: int
    top_percentage: float
    badge_name: str | None = None


class ContestHistoryItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    start_time: int
    rating: float
    ranking: int
    problems_solved: int
    total_problems: int
    trend_direction: str


class ContestAnalyticsResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    username: str
    summary: ContestSummary | None = None
    history: list[ContestHistoryItem]
