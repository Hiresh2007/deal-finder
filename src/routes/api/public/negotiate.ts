import { createFileRoute } from "@tanstack/react-router";

interface AgentOffer {
  price: number;
  deadline: number;
}

function parseAgent(value: unknown, name: string): AgentOffer {
  if (typeof value !== "object" || value === null) {
    throw new Error(`"${name}" must be an object with numeric "price" and "deadline"`);
  }
  const v = value as Record<string, unknown>;
  const price = v.price;
  const deadline = v.deadline;
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    throw new Error(`"${name}.price" must be a non-negative number`);
  }
  if (typeof deadline !== "number" || !Number.isFinite(deadline) || deadline < 0) {
    throw new Error(`"${name}.deadline" must be a non-negative number`);
  }
  return { price, deadline };
}

export const Route = createFileRoute("/api/public/negotiate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Request body must be valid JSON" }, { status: 400 });
        }

        let agentA: AgentOffer;
        let agentB: AgentOffer;
        try {
          const b = (body ?? {}) as Record<string, unknown>;
          agentA = parseAgent(b.agent_a, "agent_a");
          agentB = parseAgent(b.agent_b, "agent_b");
        } catch (e) {
          return Response.json({ error: (e as Error).message }, { status: 400 });
        }

        const price = Math.round(((agentA.price + agentB.price) / 2) * 100) / 100;
        const deadline = Math.max(agentA.deadline, agentB.deadline);

        return Response.json({
          price,
          deadline,
          rationale:
            "The middle-ground deal uses the average price to balance both sides and keeps the later deadline so the agreement preserves extra slack.",
        });
      },
    },
  },
});
