import logging
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse
from pydantic import AliasChoices, BaseModel, ConfigDict, Field, model_validator

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("deal_finder")

app = FastAPI(
    title="Deal Finder API",
    description="A lightweight negotiation matcher that helps autonomous agents agree on Pareto-optimal deals.",
    version="1.0.0",
    contact={"name": "Hiresh Yadav", "url": "https://github.com/Hiresh2007"},
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    """Return a clear 400 response for malformed requests."""
    logger.warning("Validation failed: %s", exc.errors())
    return JSONResponse(status_code=400, content={"detail": "Invalid request payload", "errors": exc.errors()})


class Agent(BaseModel):
    """Represents an agent's negotiation offer."""

    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "role": "buyer",
                "price": 100,
                "deadline_days": 7,
                "min_price": 90,
                "max_price": 120,
            }
        },
    )

    role: str = Field(
        default="agent",
        min_length=1,
        description="Role of the agent, such as buyer or seller.",
    )
    price: float = Field(..., gt=0, description="Requested price for the deal.")
    deadline_days: float = Field(
        ...,
        gt=0,
        description="Requested deadline in days.",
        validation_alias=AliasChoices("deadline_days", "deadline"),
    )
    min_price: float | None = Field(
        default=None,
        ge=0,
        description="Optional minimum price the agent will accept.",
    )
    max_price: float | None = Field(
        default=None,
        ge=0,
        description="Optional maximum price the agent will accept.",
    )

    @model_validator(mode="after")
    def validate_offer_bounds(self) -> "Agent":
        """Validate negotiation bounds for the offer."""
        if self.min_price is not None and self.max_price is not None and self.min_price > self.max_price:
            raise ValueError("min_price cannot be greater than max_price.")
        if self.min_price is not None and self.price < self.min_price:
            raise ValueError("price cannot be lower than min_price.")
        if self.max_price is not None and self.price > self.max_price:
            raise ValueError("price cannot be greater than max_price.")
        return self


class NegotiationRequest(BaseModel):
    """Request body for finding a negotiation middle ground."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "agent_a": {
                    "role": "buyer",
                    "price": 100,
                    "deadline_days": 7,
                    "min_price": 90,
                    "max_price": 120,
                },
                "agent_b": {
                    "role": "seller",
                    "price": 130,
                    "deadline_days": 10,
                    "min_price": 110,
                    "max_price": 140,
                },
            }
        }
    )

    agent_a: Agent = Field(..., description="Offer provided by the first agent.")
    agent_b: Agent = Field(..., description="Offer provided by the second agent.")


class NegotiationResponse(BaseModel):
    """Response payload for a negotiated deal."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "price": 115.0,
                "deadline": 10.0,
                "deadline_days": 10.0,
                "rationale": "The middle-ground deal uses the average price to balance both sides and keeps the later deadline so the agreement preserves extra slack.",
            }
        }
    )

    price: float = Field(..., description="The negotiated average price.")
    deadline: float = Field(..., description="The later deadline selected for the deal.")
    deadline_days: float = Field(..., description="The negotiated deadline in days.")
    rationale: str = Field(..., description="A short explanation of the negotiated outcome.")


@app.on_event("startup")
def startup_event() -> None:
    """Log application startup."""
    logger.info("Deal Finder service is starting up")


@app.get(
    "/",
    summary="API overview",
    description="Returns basic metadata about the Deal Finder API.",
    response_description="API metadata",
)
def root() -> dict[str, str]:
    """Return a lightweight welcome message for the API."""
    return {
        "name": "Deal Finder API",
        "description": "Lightweight negotiation matcher for agent-to-agent transactions.",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "skill": "/skill.md",
    }


@app.get(
    "/health",
    summary="Health check",
    description="Returns the service status and version.",
    response_description="Service health status",
)
def health() -> dict[str, str]:
    """Return a simple health payload for monitoring."""
    logger.info("Health check requested")
    return {"status": "ok", "service": "Deal Finder", "version": "1.0.0"}


@app.post(
    "/negotiate",
    response_model=NegotiationResponse,
    summary="Negotiate a deal",
    description="Finds a Pareto-optimal middle ground between two agent offers.",
    response_description="Negotiated deal details",
)
def negotiate(request: NegotiationRequest) -> NegotiationResponse:
    """Return a balanced negotiation result from two agent offers."""
    logger.info("Negotiation request received for %s and %s", request.agent_a.role, request.agent_b.role)

    try:
        average_price = round((request.agent_a.price + request.agent_b.price) / 2, 2)
        later_deadline = max(request.agent_a.deadline_days, request.agent_b.deadline_days)

        response = NegotiationResponse(
            price=average_price,
            deadline=later_deadline,
            deadline_days=later_deadline,
            rationale=(
                "The middle-ground deal uses the average price to balance both sides "
                "and keeps the later deadline so the agreement preserves extra slack."
            ),
        )
        logger.info(
            "Negotiation completed with price %.2f and deadline %.2f",
            response.price,
            response.deadline,
        )
        return response
    except ValueError as exc:
        logger.exception("Negotiation request failed")
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get(
    "/skill.md",
    summary="Skill markdown",
    description="Serves the markdown file that explains how to use this API.",
    response_description="Markdown documentation",
)
def skill_markdown() -> FileResponse:
    """Serve the SkillMD markdown file for agent integration."""
    repo_root = Path(__file__).resolve().parent
    skill_candidates = [repo_root / "SKILL.md", repo_root / "skill.md"]
    skill_path = next((path for path in skill_candidates if path.exists()), None)

    if skill_path is None:
        logger.error("Skill markdown file not found in %s", repo_root)
        raise HTTPException(status_code=404, detail="Skill markdown file not found.")

    logger.info("Skill markdown requested")
    return FileResponse(skill_path, media_type="text/markdown")
