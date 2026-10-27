import { readFileSync } from 'node:fs';
const google = JSON.parse(readFileSync(new URL('../content/google-ai-courses.json', import.meta.url)));
export const catalog = Object.freeze([google]);
export const categories = Object.freeze(['All', 'Scholarships', 'Internships', 'Competitions', 'Exchange Programs', 'Grants', 'Online Courses', 'AI Tools']);
export function listPublished(query = '', category = 'All') {
  const q = query.trim().toLowerCase();
  return catalog.filter(item => item.status === 'published' &&
    (category === 'All' || item.tags.some(tag => tag.toLowerCase() === category.toLowerCase())) &&
    (!q || [item.title, item.summary, ...item.tags].join(' ').toLowerCase().includes(q)));
}
export function articleBySlug(slug) { return catalog.find(x => x.status === 'published' && x.slug === slug); }
