interface PromptPayload {
  sender: string;
  subject: string;
  body: string;
  tone: string;
  category: string;
}

export function buildEmailReplyPrompt(
  payload: PromptPayload
) {
  return `
You are an AI email assistant.

Tone:
${payload.tone}

Category:
${payload.category}

Sender:
${payload.sender}

Subject:
${payload.subject}

Email Body:
${payload.body}

Rules:
- Write only the email reply body
- Be concise and professional
- Do NOT include placeholders
- Do NOT include signatures
- Do NOT include sign-offs
- Do NOT write "Best regards"
- Do NOT write "Thanks"
- No markdown
- No bullet points unless necessary
- Sound human and natural

IMPORTANT:
Stop immediately after reply body.
`;
}