export const formatRelativeTime = (dateString) => {
  const now = new Date();
  const then = new Date(dateString);
  const diffInSeconds = Math.floor((now - then) / 1000);

  if (diffInSeconds < 5) return 'Just now';

  const units = [
    { max: 60, value: 1, name: 's' }, // seconds
    { max: 3600, value: 60, name: 'm' }, // minutes
    { max: 86400, value: 3600, name: 'h' }, // hours
    { max: 2592000, value: 86400, name: 'd' }, // days
    { max: 31536000, value: 2592000, name: 'mo' }, // months
    { max: Infinity, value: 31536000, name: 'y' }, // years
  ];

  for (const unit of units) {
    if (diffInSeconds < unit.max) {
      const value = Math.floor(diffInSeconds / unit.value);
      return `${value}${unit.name} ago`;
    }
  }
};

export function getCompactTimeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}
