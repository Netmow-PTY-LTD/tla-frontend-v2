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
