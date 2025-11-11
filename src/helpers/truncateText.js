export function truncateText(text = '', maxLength = 150) {
  if (typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  // Trim to the last space to avoid cutting mid-word
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}
