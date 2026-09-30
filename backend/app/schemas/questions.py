from pydantic import BaseModel, ConfigDict


class DifficultyCount(BaseModel):
    model_config = ConfigDict(extra="forbid")

    difficulty: str
    count: int


class TopicCount(BaseModel):
    model_config = ConfigDict(extra="forbid")

    tag_name: str
    tag_slug: str | None = None
    problems_solved: int
    category: str


class QuestionSummary(BaseModel):
    model_config = ConfigDict(extra="forbid")

    total_solved: int
    easy: int
    medium: int
    hard: int


class QuestionAnalyticsResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    username: str
    summary: QuestionSummary
    difficulty: list[DifficultyCount]
    topics: list[TopicCount]
