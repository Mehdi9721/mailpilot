import OpenAI from 'openai';

import {
  AiProvider,
  GenerateReplyPayload
} from './ai-provider.interface';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,

  baseURL: 'https://openrouter.ai/api/v1'
});

export class OpenRouterSecondaryProvider
  implements AiProvider
{
  name = 'OPENROUTER_SECONDARY';

  async generateReply(
    payload: GenerateReplyPayload
  ) {
    const prompt = `
You are an AI email assistant.

Tone:
${payload.tone}

Reply professionally.

${payload.body}
`;

    const response =
      await client.chat.completions.create({
        model:
          process.env
            .OPENROUTER_MODEL_SECONDARY ||

          'qwen/qwen3-32b',

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