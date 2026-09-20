interface ShareScoreParams {
  score: number;
  timeFormatted: string;
  moves: number;
  difficultyName: string;
}

export async function shareScore({
  score,
  timeFormatted,
  moves,
  difficultyName,
}: ShareScoreParams): Promise<{ shared: boolean; method: 'web-share' | 'clipboard' }> {
  const shareText = `🧠 I scored ${score.toLocaleString()} on ${difficultyName} in Memory Match!
⏱️ Time: ${timeFormatted}
🎯 Moves: ${moves}

Can you beat my score? Play free online!`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Memory Card Game',
        text: shareText,
        url: window.location.href,
      });
      return { shared: true, method: 'web-share' };
    } catch (err: unknown) {
      // User cancelled share or share failed
      if ((err as Error)?.name === 'AbortError') {
        return { shared: false, method: 'web-share' };
      }
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
    return { shared: true, method: 'clipboard' };
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = `${shareText}\n${window.location.href}`;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return { shared: true, method: 'clipboard' };
  }
}
