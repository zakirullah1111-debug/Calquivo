# Calquivo launch plan

## Release 1: make the existing tools useful and discoverable
Keep a focused student-grade site. Fix the homepage layout, explain calculated results, show weight totals, link related tools, and publish canonical URLs and a sitemap on the confirmed Cloudflare origin. Keep all calculations local to the browser.

## Next: measure and learn (first 30 days)
Owner action: add https://calquivo.swastu1111.workers.dev/ as a URL-prefix property in Google Search Console. Use its HTML verification file or meta tag, then submit sitemap.xml. Verification tokens must come from the owner; none are invented. Check indexing and errors weekly, not daily ranking fluctuations.

Ask 5-10 students or instructors to try their actual syllabus rules. Record confusing fields, unsupported policies, and arithmetic discrepancies without collecting private grade records. Fix those before expanding.

## Days 30-60: choose the next calculator using evidence
Review Search Console queries, impressions, clicks, landing pages, and user feedback. Candidate ideas: points-based course grades; grade needed on remaining assignments; weighted GPA with an explicit, editable grade scale. These are hypotheses, not researched demand or competition claims. Choose one only after reviewing current search results and whether existing tools miss a real use case.

## Days 60-90: improve the strongest pages
Use actual queries to clarify titles and explanations. Add original examples for supported course policies. Seek feedback from relevant educational communities without bulk posting or buying links. Expand only if the new page solves a distinct task; avoid duplicate pages for keyword variants.

## Monetization and costs
Keep infrastructure lean. Evaluate ads once the site has useful original content, stable operation, and real traffic; review current AdSense requirements and privacy/consent obligations before applying. Ad approval, rankings, traffic, and revenue are not guaranteed. Do not project $400/month from a site count alone. Estimate revenue later from measured page views and actual page RPM.

## Domain migration
When a custom domain is chosen, attach it in Cloudflare, update scripts/seo.mjs, run npm run seo, and deploy. Plan redirects from the old address and update Search Console. Do not mix two origins in canonicals and sitemaps.

References: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap and https://developers.google.com/search/docs/fundamentals/creating-helpful-content
