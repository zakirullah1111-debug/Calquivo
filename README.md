# Calquivo
Static student grade-planning tools. No database, production dependencies, or build step.

## Local preview
Run `python -m http.server 4173 --directory public`, then open http://localhost:4173.
Run `npm test` to check calculation examples and edge cases.

## Cloudflare Workers deployment
Existing Worker name: `calquivo`.
- Root directory: `/`
- Build command: leave empty
- Deploy command: `npx wrangler deploy`
- Assets directory: `public` (configured in wrangler.jsonc)
Push to the connected main branch to trigger deployment. A Workers project uses a workers.dev address, not pages.dev.

## Models
Final calculator uses normalized completed-work average. Replacement model assumes equally weighted eligible midterms, higher-only replacement of one lowest exam, and a separately weighted final. Weighted calculator drops lowest percentages, not Canvas points-impact drops.

## Before promotion
Verify examples against intended grading policies with student/instructor reviewers. Confirm production URL and add canonical URLs and sitemap for that origin. No custom domain is assumed yet. Add advertising/analytics only with an updated privacy notice and applicable consent handling. No ad or revenue claims are made.
