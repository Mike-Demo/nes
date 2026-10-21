# Security audit triage — 2026-10-21

Issue creation is not available in this session. The following issue titles and
bodies are ready to file in this repository and link back to
[the audit issue](https://github.com/Mike-Demo/nes/issues/4).

## Prioritized confirmed remediation issues

There is one confirmed finding, so it is the highest-priority item. It is
reachable by any authenticated self-service author through the public backend,
and the proposed changes are limited to database constraints and gallery
pagination. The storage and read-path problems are grouped as one finding
because both omit bounds for the same small icon model.

### Issue title

`[security][medium] Bound pixel icon payloads and paginate gallery reads`

### Issue body

**Finding:** Unbounded `pixel_icons` JSONB payloads and unbounded gallery reads
let one author impose storage and bandwidth costs on the operator and every
visitor.

**Fingerprint:** `unbounded-pixel-icon-jsonb-and-gallery-read`

**Evidence:** The `pixel_icons` schema constrains name length and the size enum,
but puts no size or shape checks on `pixels` or `palette`
(`supabase/migrations/20260913004619_7543b78a-a113-47e8-a6db-a616d8f2536e.sql`).
The authenticated insert and update policies check owner identity only. A
self-service authenticated author can bypass client validation and repeatedly
store arbitrarily large JSONB payloads through PostgREST. The gallery service
selects all columns and rows without a limit or range
(`src/showcase/studio/pixel-icons.service.ts`), and the gallery calls it on
mount (`src/showcase/IconGallery.tsx`).

**Root cause:** The database schema does not bound the JSONB payloads, and the
gallery read path does not paginate. Neither side enforces the small 8, 16, or
32 icon model assumed by client validation.

**Smallest fix:** Add database `CHECK` constraints that bound `pixels` and
`palette` to the icon model (for example, payload-size caps, a palette
array-length cap, and pixel shape consistent with `size`). Paginate
`listPixelIcons` with a range so gallery cost does not grow with the total
number of stored rows.

**Priority:** Highest among the confirmed findings in this audit. A lower-trust
authenticated author can cause repeated storage growth, and the unbounded
public read multiplies its bandwidth impact across gallery visitors. The
database and query changes are narrow and directly address both sides of this
single root-cause group.

**Parent:** [Security audit 2026-10-21](https://github.com/Mike-Demo/nes/issues/4).

## Needs-validation checklist issue

### Issue title

`[security][needs-validation] Audit leads to validate`

### Issue body

Validate each lead by establishing its missing deployment or consumer fact.
These are not confirmed findings; do not assign severity until the missing
facts are known.

- [ ] **Component preview accepts specimen props from any parent frame without
  an origin check**
  - **Fingerprint:** `preview-postmessage-props-no-origin-check`
  - **Claimed root cause:** The `DS_SPECIMEN_PROPS` listener in the component
    preview route omits `event.origin` validation, unlike the sibling preview
    auth broker which validates editor origins, so any parent frame that can
    frame the preview could drive its rendering state.
  - **Exact missing fact:** Whether the served Lovable preview (or
    localhost-served) deployment of the `/__component/preview` route sends
    framing protections (`X-Frame-Options` or CSP `frame-ancestors`) or is
    otherwise framable by an arbitrary untrusted origin - the preview host's
    actual response headers and access controls, which are set by the platform
    and absent from this repo.

- [ ] **Unauthenticated `POST /api/generate-pixel-icon` spends the operator
  Lovable AI key with no auth or rate limit**
  - **Fingerprint:** `unauthenticated-ai-generation-spends-operator-key`
  - **Claimed root cause:** The route handler performs operator-keyed paid
    generation without applying the repository's `requireSupabaseAuth`
    middleware or any per-caller rate limit or quota, so any anonymous caller
    who can reach a served instance could spend operator credits.
  - **Exact missing fact (as stated in the audit issue):** Whether any
    actually-served deployment that runs this server route - specifically the
    Lovable preview hosting the docs say the route still works in, or a future
    TanStack server deployment - exposes `POST /api/generate-pixel-icon` to
    anonymous (non-workspace, unauthenticated) callers, i.e. the preview's
    access-control and sharing settings and whether…

- [ ] **`pixelIconToSvg` interpolates stored palette strings unescaped into SVG
  markup**
  - **Fingerprint:** `unescaped-palette-fill-in-svg-export`
  - **Claimed root cause:** `pixelIconToSvg` builds SVG markup by string
    interpolation of an unvalidated stored palette value without attribute
    escaping or colour validation, so stored data can break out of the `fill`
    attribute in the generated markup string.
  - **Exact missing fact:** How recipients and downstream consumers of the
    exported SVG string actually embed it: whether any real consumer inserts
    `pixelIconToSvg` output as inline markup or serves or opens it as a
    standalone SVG document (script-executing contexts), as opposed to `img`
    embedding or clipboard-only use as in this repo.

**Parent:** [Security audit 2026-10-21](https://github.com/Mike-Demo/nes/issues/4).
