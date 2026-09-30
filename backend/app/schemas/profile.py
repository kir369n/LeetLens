from pydantic import BaseModel, ConfigDict


class ProfileDetails(BaseModel):
    model_config = ConfigDict(extra="forbid")

    real_name: str | None = None
    avatar_url: str | None = None
    ranking: int | None = None
    reputation: int | None = None
    country: str | None = None
    school: str | None = None
    company: str | None = None
    job_title: str | None = None
    bio: str | None = None


class SocialLinks(BaseModel):
    model_config = ConfigDict(extra="forbid")

    github: str | None = None
    linkedin: str | None = None
    twitter: str | None = None


class UserProfileResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    username: str
    profile: ProfileDetails
    social: SocialLinks
