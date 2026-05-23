import OpenAI from 'openai';

import {
  AiProvider,
  GenerateReplyPayload
} from './ai-provider.interface';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,

  baseURL: 'https://openrouter.ai/api/v1'
});

export class OpenRouterProvider
  implements AiProvider
{
  name = 'OPENROUTER_PRIMARY';

  async generateReply(
    payload: GenerateReplyPayload
  ) {
    const prompt = `
You are an AI email assistant.

Category:
${payload.category}

Tone:
${payload.tone}

Subject:
${payload.subject}

Email:
${payload.body}

Generate professional email reply only.
`;

    const response =
      await client.chat.completions.create({
        model:
          process.env
            .OPENROUTER_MODEL_PRIMARY ||

          'deepseek/deepseek-chat-v3-0324',

        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

    return (
      response.choices[0].message.content ||
      ''
    );
  }
}