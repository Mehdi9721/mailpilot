import { extractDomain } from '../../utils/extract-domain';

interface Rule {
  autoReplyEnabled: boolean;
  allowedDomains: string[];
  blockedDomains: string[];
}

export function shouldAutoReply(
  sender: string,
  rule: Rule
) {
  if (!rule.autoReplyEnabled) {
    return false;
  }

  const domain = extractDomain(sender);

  if (
    rule.blockedDomains.includes(domain)
  ) {
    return false;
  }

  if (
    rule.allowedDomains.length > 0 &&
    !rule.allowedDomains.includes(domain)
  ) {
    return false;
  }

  return true;
}