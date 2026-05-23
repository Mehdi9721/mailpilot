export interface GenerateReplyPayload {
  subject: string;
  body: string;
  category: string;
  tone: string;
}

export interface AiProvider {
  name: string;

  generateReply(
    payload: GenerateReplyPayload
  ): Promise<string>;
}