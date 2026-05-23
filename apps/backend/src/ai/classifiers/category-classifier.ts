export function classifyEmailCategory(
  subject: string,
  body: string
): string {
  const content = `${subject} ${body}`.toLowerCase();

  if (
    content.includes('refund') ||
    content.includes('payment')
  ) {
    return 'BILLING';
  }

  if (
    content.includes('bug') ||
    content.includes('issue') ||
    content.includes('error')
  ) {
    return 'SUPPORT';
  }

  if (
    content.includes('partnership')
  ) {
    return 'BUSINESS';
  }

  if (
    content.includes('complaint')
  ) {
    return 'COMPLAINT';
  }

  return 'GENERAL';
}