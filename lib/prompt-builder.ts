/**
 * Global LLM instructions shared across all scenarios.
 *
 * Defines the scoring rubric, feedback fields, response format, and ending
 * behaviour. Each scenario only needs to supply its persona intro, trigger
 * rule, and ending rule via `buildSystemPrompt()`.
 */

const SCORING_INSTRUCTIONS = `\
## Scoring
After each user message, score their small talk across six dimensions (each 1–10).
Be a STRICT and HONEST evaluator. Do NOT default to mid-range scores out of politeness.
Use the FULL 1–10 scale. Bad responses MUST receive low scores (1–4). Average responses score 5–6. Only genuinely good small talk earns 7–10.

Scoring dimensions:
- **naturalness** (1-10): how fluid and human the message sounds
  - 1-2: completely off-topic, nonsensical, or robotic
  - 3-4: awkward, forced, or barely related to the conversation
  - 5-6: passable but generic
  - 7-10: flows naturally and fits the context well
- **engagement** (1-10): how well it invites the conversation to continue
  - 1-2: shuts down the conversation or is completely irrelevant
  - 3-4: low effort, dead-end reply with no invitation to continue
  - 5-6: some effort but predictable
  - 7-10: genuinely draws the other person in
- **warmth** (1-10): friendliness and positive emotional tone
  - 1-2: rude, offensive, inappropriate, or hostile
  - 3-4: cold, dismissive, or socially tone-deaf
  - 5-6: neutral
  - 7-10: warm, genuine, and likeable
- **originality** (1-10): avoids clichés, adds personality
  - 1-2: spam-like, inappropriate, or completely off-subject
  - 3-4: heavily clichéd or copy-paste generic
  - 5-6: somewhat predictable
  - 7-10: fresh, personal, memorable
- **activeListening** (1-10): whether they reference or build on something you just said
  - 1-2: ignores everything said, completely tangential
  - 3-4: barely acknowledges what was said
  - 5-6: some reference but superficial
  - 7-10: clearly listened and builds meaningfully on it
- **questionQuality** (1-10): whether they ask a thoughtful, open-ended follow-up question
  - 1-2: no question, or a rude/inappropriate question
  - 3-4: closed yes/no question or question that kills conversation
  - 5-6: a basic but acceptable question
  - 7-10: an open-ended, curious, and thoughtful question

STRICT RULES:
- If the user's message is off-topic (unrelated to the conversation or scenario), ALL dimensions score 1–3.
- If the user's message is rude, offensive, or inappropriate, warmth and naturalness score 1–2.
- If the user's message is a one-word reply or near-empty effort, engagement and questionQuality score 1–3.
- NEVER give a score above 5 for a dimension where the user clearly failed that dimension.
- The overall score MUST reflect the true quality. A bad response should yield an overallScore of 1–4.

Compute **overallScore** as the rounded average of all six dimensions.`;

const FEEDBACK_INSTRUCTIONS = `\
## Feedback
Also provide:
- **feedback**: one honest sentence summarising their performance this turn — do NOT sugarcoat bad responses
- **skillHighlight**: one specific thing they did WELL (if nothing was good, say so honestly, e.g. "Nothing stood out this turn — try harder next time")
- **coachingTip**: one concrete, actionable thing they can try in their very next message to improve`;

const RESPONSE_FORMAT = `\
## Response Format
Always respond in this EXACT JSON format with no extra text outside the JSON:
\`\`\`json
{
  "reply": "your conversational response",
  "scores": {
    "naturalness": <1-10>,
    "engagement": <1-10>,
    "warmth": <1-10>,
    "originality": <1-10>,
    "activeListening": <1-10>,
    "questionQuality": <1-10>
  },
  "overallScore": <rounded average 1-10>,
  "feedback": "one short sentence summarising their performance",
  "skillHighlight": "one thing they did well this turn",
  "coachingTip": "one concrete thing to try next message",
  "triggerActivated": <true|false>,
  "bonusMessage": "<bonus reveal string or null>",
  "conversationEnded": <true|false>,
  "finalSummary": "<2-3 sentence wrap-up or null>"
}
\`\`\``;

export interface ScenarioPromptParts {
  /** Persona identity, tone, and response-length guidance. */
  personaIntro: string;
  /** When to set triggerActivated=true and what to put in bonusMessage. */
  triggerRule: string;
  /** When and how to end the conversation (conversationEnded + finalSummary). */
  endingRule: string;
}

/**
 * Assembles a complete system prompt by combining scenario-specific parts
 * with the global scoring, feedback, and format instructions.
 */
export function buildSystemPrompt({
  personaIntro,
  triggerRule,
  endingRule,
}: ScenarioPromptParts): string {
  return [
    "## Persona",
    personaIntro,
    "## Hidden Trigger",
    triggerRule,
    SCORING_INSTRUCTIONS,
    FEEDBACK_INSTRUCTIONS,
    "## Ending the Conversation",
    endingRule,
    RESPONSE_FORMAT,
  ].join("\n\n");
}
