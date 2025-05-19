export function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')       // Replace spaces and underscores with hyphens
    .replace(/[^\w\-]+/g, '')      // Remove all non-word chars
    .replace(/\-\-+/g, '-')        // Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, '');      // Trim hyphens from start and end
}
