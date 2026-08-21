# JARVIS AI 1.12.8

## Structured Knowledge Update Agent

- Generator and Critic calls now use Cloudflare Workers AI JSON Schema mode.
- Supports both object responses from JSON Mode and correctly fenced JSON text.
- Replaces greedy brace extraction with quote-aware, balanced JSON-object extraction.
- Performs one controlled self-correction retry when a model returns malformed structured data.
- Returns a clear retry message instead of exposing a raw `JSON.parse` position error.
- Maintains the two-independent-domain rule, critic validation, and explicit human approval before any knowledge enters Memory Vault.
- Adds regression tests for JSON Mode objects, fenced JSON, malformed JSON rejection, and successful retry recovery.

All previous JARVIS functions and safeguards remain included, including the v1.12.7 weather parser correction.
