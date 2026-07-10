from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Deal Finder", version="1.0.0")


class AgentOffer(BaseModel):
    price: float = Field(..., ge=0, description="Requested price")
    deadline: float = Field(..., ge=0, description="Requested deadline")


class NegotiationRequest(BaseModel):
    agent_a: AgentOffer
    agent_b: AgentOffer


class NegotiationResponse(BaseModel):
    price: float
    deadline: float
    rationale: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/negotiate", response_model=NegotiationResponse)
def negotiate(request: NegotiationRequest) -> NegotiationResponse:
    average_price = round((request.agent_a.price + request.agent_b.price) / 2, 2)
    later_deadline = max(request.agent_a.deadline, request.agent_b.deadline)

    return NegotiationResponse(
        price=average_price,
        deadline=later_deadline,
        rationale=(
            "The middle-ground deal uses the average price to balance both sides "
            "and keeps the later deadline so the agreement preserves extra slack."
        ),
    )
