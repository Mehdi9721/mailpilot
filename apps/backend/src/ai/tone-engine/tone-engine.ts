interface TonePayload {
  category: string;
  tone: string;
}

export function buildToneInstruction(
  payload: TonePayload
) {
  return `
Reply Tone Rules:

Category:
${payload.category}

Tone:
${payload.tone}

Reply Requirements:
- Keep response professional
- Keep response concise
- Avoid hallucinations
- Be context aware
`;
}