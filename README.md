# Deal Finder

Deal Finder is a lightweight FastAPI service designed for agent-to-agent negotiation. It helps two autonomous agents agree on a fair middle ground by combining an average price with the later deadline, making it useful for pre-payment coordination and negotiation workflows.

## Features

- Health check endpoint
- Negotiation endpoint for agent-to-agent deals
- Skill markdown endpoint for AI agent integration
- Swagger documentation for interactive testing
- Render-ready deployment configuration

## Project structure

```text
main.py
SKILL.md
requirements.txt
Procfile
README.md
```

## Installation

```bash
pip install -r requirements.txt
```

## Local run

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Then open:

- http://127.0.0.1:8000/docs
- http://127.0.0.1:8000/health

## Render deployment

Render can deploy this service using the existing Procfile:

```text
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

## API endpoints

- GET /
- GET /health
- POST /negotiate
- GET /skill.md

## Example curl commands

### Health check

```bash
curl https://your-app.onrender.com/health
```

### Negotiate a deal

```bash
curl -X POST https://your-app.onrender.com/negotiate \
  -H "Content-Type: application/json" \
  -d '{"agent_a":{"role":"buyer","price":100,"deadline_days":7,"min_price":90,"max_price":120},"agent_b":{"role":"seller","price":130,"deadline_days":10,"min_price":110,"max_price":140}}'
```

### Read the skill markdown

```bash
curl https://your-app.onrender.com/skill.md
```

## Screenshots

Placeholder for demo screenshots.

## License

Apache 2.0
