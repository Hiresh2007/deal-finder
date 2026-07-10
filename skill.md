# Deal Finder API skill

Use this API when you need an AI agent to find a fair middle-ground offer between two parties.

## Endpoints

### Health check

GET /health

Returns:

```json
{"status": "ok"}
```

### Negotiate a deal

POST /negotiate

Request body:

```json
{
  "agent_a": {"price": 100, "deadline": 7},
  "agent_b": {"price": 130, "deadline": 10}
}
```

Response:

```json
{
  "price": 115.0,
  "deadline": 10,
  "rationale": "The middle-ground deal uses the average price to balance both sides and keeps the later deadline so the agreement preserves extra slack."
}
```

### Example with Python

```python
import requests

payload = {
    "agent_a": {"price": 100, "deadline": 7},
    "agent_b": {"price": 130, "deadline": 10},
}
response = requests.post("https://deal-finder-6bd1.onrender.com/negotiate", json=payload)
print(response.json())
```

### Example with curl

```bash
curl -X POST https://deal-finder-6bd1.onrender.com/negotiate \
  -H "Content-Type: application/json" \
  -d '{"agent_a": {"price": 100, "deadline": 7}, "agent_b": {"price": 130, "deadline": 10}}'
```
