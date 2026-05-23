import ollama from 'ollama';

import {
  AiProvider,
  GenerateReplyPayload
} from './ai-provider.interface';

import {
  buildEmailReplyPrompt
} from '../prompts/email-reply.prompt';

export class OllamaProvider
  implements AiProvider
{
  name = 'OLLAMA_QWEN';

  async generateReply(
    payload: GenerateReplyPayload
  ) {
    const prompt =
      buildEmailReplyPrompt(payload);

    const response = await ollama.chat({
      host:
        process.env.OLLAMA_BASE_URL,

      model:
        process.env.OLLAMA_MODEL ||

        'qwen2.5:latest',

      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return response.message.content;
  }
}