# CampusCart implementation plan

## Product scope

CampusCart is a student-focused e-commerce demonstration site for affordable campus food, groceries, stationery, and everyday essentials. Students can browse products, filter by category, view product details, add items to a cart, adjust quantities, review delivery and total costs, and submit a simple order request. The page also explains the platform's customer value, vendor value, owner value, and revenue model for the e-commerce group assignment.

The first release intentionally keeps checkout as an order request rather than a live payment integration. This makes the flow easy to demonstrate in class while still showing the essential e-commerce journey from discovery through order confirmation. Group-member names and admission numbers remain editable placeholders until they are supplied.

## Design direction

Three possible directions were considered:

- **Editorial campus market** — 0.07: warm paper tones, confident ink, coral accents, and a magazine-like split layout.
- **Fresh delivery dashboard** — 0.06: cool blue surfaces, compact cards, and a utility-first delivery command center.
- **Playful student noticeboard** — 0.04: bright primary colors, sticker-like shapes, and a more youthful visual rhythm.

### Chosen style: Editorial campus market

- **Design Movement:** Contemporary editorial commerce, combining the warmth of a campus noticeboard with the hierarchy and confidence of a small independent marketplace.
- **Core Principles:** Make the next useful action obvious; show prices and delivery expectations early; balance practical information with human warmth; use generous spacing so the interface never feels like a catalogue dump.
- **Color Philosophy:** Warm ivory keeps the page approachable and paper-like; deep ink gives the brand trust; coral creates a recognisable action color; mint and butter highlights make categories feel friendly without becoming childish.
- **Layout Paradigm:** A split hero anchors the page with a strong promise on the left and a live-looking order snapshot on the right. Below it, categories run as a horizontal shelf, while the product area alternates dense browsing with short editorial explanation bands.
- **Signature Elements:** A coral ticket-shaped label for delivery promises, rounded product art tiles using simple line icons, and a subtle ruled-paper texture in the assignment/business sections.
- **Interaction Philosophy:** Every interactive element gives immediate feedback: cart counts update in the header, totals recalculate in place, filters preserve the browsing context, and successful orders receive a clear confirmation rather than disappearing into a backend.
- **Animation:** Use short, low-key transitions for cards, buttons, cart changes, and section reveal. Avoid continuous motion; the site should feel dependable and quick on campus Wi-Fi.
- **Typography System:** Use Fraunces for high-impact display headings and Plus Jakarta Sans for navigation, labels, prices, and body copy. Headings are compact and editorial; supporting text is readable with comfortable line height.
- **Brand Essence:** CampusCart is the quick, affordable campus shop for students who want essentials without leaving their study spot. Personality: practical, warm, dependable.
- **Brand Voice:** Headlines are direct and grounded; CTAs sound helpful, not salesy. Example lines: “Your campus run, sorted.” and “Add it now, collect your time back.”
- **Wordmark & Logo:** A compact coral cart-basket mark sits beside a lowercase wordmark, suggesting a shopping basket and a campus pin without using a generic bag icon.
- **Signature Brand Color:** Campus Coral (#ed6a5a), used for primary actions, order confirmation, and the small delivery promise label.

## Implementation approach

- Keep the page public and demonstration-ready without requiring login.
- Use a local product catalogue in `client/src/pages/Home.tsx` so the class demonstration works immediately and remains easy to edit.
- Store the cart in React state and mirror it to local storage so a refresh does not lose the student's basket.
- Use a lightweight product detail dialog and a slide-in cart panel with a two-step checkout state: cart review, then order request form.
- Use semantic sections and anchor navigation for Store, How it works, and Business model.
- Keep database/server scaffolding intact for future persistence, but do not add unnecessary backend complexity to the assignment demo.
- Serve `client/public/manus-routes.json` with the single `/` route declaration before starting the preview.

## Project structure

- `client/src/pages/Home.tsx`: storefront state, product catalogue, cart interactions, checkout request, and assignment content.
- `client/src/index.css`: CampusCart visual system, responsive layout helpers, product art, and motion.
- `client/src/App.tsx`: route entry and application providers.
- `client/index.html`: document title and typography imports.
- `client/public/manus-routes.json`: page route manifest for the public site.
- `app.config.ts`: project logo metadata.
- `TODO.md`: outcome-based acceptance items and current progress.
