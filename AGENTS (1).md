# Agents

## Conversation Agent
Chats naturally with the user. Never sounds like it's profiling them. After every reply, appends `TRAITS: ["..."]` — a JSON array of inferred facts about the user (max 8). The reply shown to the user is everything before that line.

## Joke Agent
Reads `traits[]`. Writes one personalized joke as `{"setup":"...","punchline":"...","tags":[]}`. Wild card mode adds surprise/unexpectedness.

## Advice Agent
Reads `traits[]`. Writes one honest, specific piece of advice as `{"headline":"...","body":"...","tags":[]}`. No clichés. Surprise mode pushes it in an unexpected direction.

## Shared state
`history[]` — full conversation (Conversation Agent)
`traits[]` — inferred user facts (written by Conversation Agent, read by Joke + Advice agents). Resets on "Start over".
