export async function notifySlack(text) {
  if (!process.env.SLACK_WEBHOOK_URL) {
    return { skipped: true };
  }

  const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.status}`);
  }

  return { sent: true };
}
