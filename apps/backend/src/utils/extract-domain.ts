export function extractDomain(
  email: string
): string {
  return email.split('@')[1]?.toLowerCase() || '';
}