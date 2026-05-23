import { OpenRouterProvider }
  from '../providers/openrouter.provider';

import { OpenRouterSecondaryProvider }
  from '../providers/openrouter-secondary.provider';

import { OllamaProvider }
  from '../providers/ollama.provider';

import {
  GenerateReplyPayload
} from '../providers/ai-provider.interface';

import logger from '../../logger/logger';

const providers = [
  new OpenRouterProvider(),
  new OpenRouterSecondaryProvider(),
  new OllamaProvider()
];

export async function generateAiReply(
  payload: GenerateReplyPayload
) {
  for (const provider of providers) {
    try {
      logger.info(
        `Trying provider: ${provider.name}`
      );

      const reply =
        await provider.generateReply(
          payload
        );

      logger.info(
        `Provider success: ${provider.name}`
      );

      return {
        provider: provider.name,
        reply
      };
    } catch (error) {
      logger.error({
        provider: provider.name,
        error: String(error)
      });

      logger.warn(
        `Provider failed: ${provider.name}`
      );
    }
  }

  throw new Error(
    'All AI providers failed'
  );
}