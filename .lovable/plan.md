# Make design.2.mikedemo.dev agent-friendly

## What the report found
The audit scored L0 because every request came back "403 Forbidden". I checked this myself today:
- Live site with an AI-bot identity (GPTBot): **403** on `/` and `/robots.txt`
- Same pages with a normal browser identity: **200**

So the site itself is fine. The hosting layer (Spacefast or the domain's firewall/bot protection) blocks AI crawlers before they reach your pages. **No code change can fix that part.** The other checks are real gaps we can close in code.

design.1 (Font Awesome build) is a different project and isn't covered here.

## Part 1 — Your side (hosting, required first)
In Spacefast / your DNS provider's security settings for `design.2.mikedemo.dev`:
1. Turn off or relax "Bot Fight Mode" / "Block AI crawlers" / managed WAF bot rules.
2. Or add an allow rule for known agent user-agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot).
3. Apply the same change to design.1.

I won't touch hosting or DNS, as you asked. Afterwards I'll re-test with the bot identity.

## Part 2 — Code changes (in this project)
1. **robots.txt**: use the full sitemap address (`https://design.2.MikeDemo.dev/sitemap.xml`) and explicitly allow the main AI crawlers.
2. **llms.txt** (new, `public/llms.txt`): a short plain-text description of the NES design system, with links to every main page and spec page, the install/import instructions and licenses.
3. **llms-full.txt** (new): the full component list with props and usage, generated from the same list the spec pages use, so agents get it in one file.
4. **Structured data (JSON-LD)**: add Schema.org data baked into the prerendered pages — `WebSite` + `SoftwareSourceCode` on the home page, `TechArticle` on each spec page.
5. **Meta tags check**: confirm every one of the 30 pages has its own title, description, og and twitter tags in the static HTML; fill any gaps.
6. **Semantic HTML check**: confirm header/nav/main/footer landmarks are in the static HTML (skip link and `<main>` already exist).
7. **Sitemap**: add `llms.txt` pointer in robots; keep sitemap entries in sync.
8. Update `docs/deployment.md` and `roadmap.md`.

## Out of scope (and why)
Levels 3–5 (public API, OpenAPI, MCP server, webhooks, agent auth, streaming) need a running server. This site is static by design, so these would be a separate project. Realistic target after this work: **L1–L2**.

## Verification
- Typecheck and full static build; confirm `dist/client` has `llms.txt`, `llms-full.txt`, updated `robots.txt`, and JSON-LD in each page's HTML.
- Fetch the built pages without JavaScript to confirm content, meta tags and landmarks are present.
- After you change hosting: re-curl the live site with a bot identity and expect 200.

## Rollback
All changes are new static files plus `head()` additions; reverting the commit restores the current state with no effect on the app.
