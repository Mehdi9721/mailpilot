import ollamaClient from './ollama-client';

interface GenerateDraftPayload {
  sender: string;
  subject: string;
  body: string;
  tone: string;
  category: string;
}

export async function generateDraft(
  payload: GenerateDraftPayload
) {
 console.table(payload);
 
  const prompt = `
You are an AI email assistant.

Tone: ${payload.tone}
Category: ${payload.category}
Sender: ${payload.sender}
Subject: ${payload.subject}
Body: ${payload.body}

Rules:
- Write only the email body reply
- Do NOT include any placeholders like [Your Name], [Your Position], [], or similar
- Do NOT generate any sign-off or closing like "Best regards" or "Thanks"
- Do NOT add signature text

IMPORTANT:
You must STOP after the email body. No closing lines.

DO NOT WRITE SIGN-OFFS.
`;

  const response = await ollamaClient.chat({
    model: 'qwen2.5:latest',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

 const reply = response.message.content;

const signature = `

Best regards,
MailPilot by Syed Mohd Mehdi
Software Engineer
syedmohd3433@gmail.com
`;

return `${reply.trim()}${signature}`;
}