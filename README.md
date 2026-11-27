# Growth Marketing Agency — Angular 22 Application

A modern, high-performance migration of the complete **Growth Marketing Agency** website into Angular 22, featuring an **automatic full-viewport welcome video introduction**.

This project preserves 100% of the approved visual design, branding, typography, color palette, animations, floating hero badges, mascot, and responsive layouts while replacing legacy static markup with modern Angular architecture.

---

## 🚀 Key Highlights & Architectural Features

- **Angular 22 & TypeScript Strict Mode:** Built with standalone Angular components, strict type checking, and modern component control flow (`@if`, `@for`).
- **Automatic Welcome Video Intro (`WelcomeIntroComponent`):**
  - Displays the original `mascot-welcome-video.mp4` immediately upon fresh page load, browser refresh, or direct route access (e.g. `/services`, `/blog`) before revealing the main website.
  - Automatically starts video playback without requiring a user click (`autoplay`, `muted`, `playsinline`, `preload="auto"`).
  - Plays once from start to finish, then automatically fades out smoothly (~600 ms) to reveal the underlying website.
  - **No Replay During Client-Side Navigation:** Managed via in-memory state (`WelcomeIntroService`). When navigating between pages using Angular Router, the intro does **not** replay. A fresh page reload or browser restart will play it once again.
  - **Responsive Framing:** Preserves the video's vertical aspect ratio with `object-fit: contain` on desktop, tablet, and mobile so the character's head, hands, body, and feet are never cropped or stretched. Unused viewport area is filled with a clean white/cream branded aesthetic and a soft blurred mirror video backdrop.
  - **Accessibility & Controls:** Features an accessible, keyboard-focusable **"Skip Intro"** button and an optional Mute/Unmute sound toggle. Honors `prefers-reduced-motion: reduce`.
  - **Error & Timeout Fallbacks:** Automatically falls back and reveals the website if video playback is blocked or fails to load within 6 seconds.
- **Lazy-Loaded Route Architecture:** All four core views (`/`, `/about`, `/services`, `/blog`) are lazy loaded via Angular Router (`loadComponent`), keeping the initial bundle light (~74 kB transfer size).
- **Exact Brand & Asset Preservation:** The original `growth-logo.png`, `growth-mascot.png`, and `favicon.png` are preserved without alteration or substitution.
- **Dynamic Wave Canvas Background:** Encapsulated in `<app-wave-canvas>`, featuring 6 sine/cosine stroke waves and 41 floating particles. Cleanly manages lifecycle (`cancelAnimationFrame`), unregisters window resize and visibility listeners upon component destruction, and honors `prefers-reduced-motion: reduce`.
- **Google Sheets publishing** loads published articles, provides search and category filters, and opens articles in a shareable reader.
- **Consultation form** validates submissions and saves them through a Vercel function to a private Google Sheet.
- **Full Responsive Design:** Tailored styles for Desktop (1920x1080), Laptop (1366x768), Tablet landscape & portrait (1024x768, 768x1024), and Mobile (390x844, 360x800).

---

## 📁 Project Structure

```
growth-marketing-angular/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── favicon.png
│   │   │   ├── growth-logo.png                     # Original logo (preserved)
│   │   │   ├── growth-mascot.png                   # Original mascot
│   │   │   ├── mascot-handshake-with-client.jpeg   # Partnership showcase
│   │   │   └── mascot-presenting.jpeg              # Services spotlight
│   │   └── media/
│   │       └── mascot-welcome-video.mp4            # Welcome video asset (2.86 MB)
│   └── favicon.ico
├── src/
│   ├── index.html                                  # App shell with global SVG icon sprite
│   ├── styles.css                                  # Preserved theme styles and responsive rules
│   ├── main.ts                                     # Angular bootstrap
│   └── app/
│       ├── app.ts                                  # Root standalone component
│       ├── app.html                                # App layout with welcome-intro, header, router-outlet, footer
│       ├── app.css                                 # Host flexbox styling
│       ├── app.config.ts                           # App configuration with router scrolling
│       ├── app.routes.ts                           # Lazy-loaded routes for 4 main pages
│       ├── core/
│       │   ├── models/
│       │   │   └── blog.model.ts                   # Published article types
│       │   └── services/
│       │       ├── blog.service.ts                 # Typed blog data and filtering service
│       │       ├── welcome-intro.service.ts        # Lifecycle state management for intro
│       │       ├── seo.service.ts                  # Title and Meta tag management
│       │       └── toast.service.ts                # Application notification system
│       ├── shared/
│       │   └── components/
│       │       ├── welcome-intro/                  # Full-viewport automatic video intro
│       │       ├── header/                         # Shared sticky header & mobile navigation
│       │       ├── footer/                         # Shared footer with dynamic year
│       │       ├── wave-canvas/                    # Decorative canvas animation with cleanup
│       │       ├── article-dialog/                 # Full blog article reader modal
│       │       └── toast/                          # Floating feedback toast
│       └── features/
│           ├── home/                               # Home view with hero, mascot, previews, form
│           ├── about/                              # About Us view with partnership showcase
│           ├── services/                           # Services view with spotlight & detailed cards
│           └── blog/                               # Blog view with search, filter pills, grid
│               └── data/
```

---

## 🛠️ Installation & Getting Started

### Prerequisites
- Node.js: `v20.x` or `v24.x` (verified on v24.22.2)
- npm: `v10.x` or `v11.x`

### 1. Install Dependencies
```bash
cd growth-marketing-angular
npm install
```

### 2. Development Server
Run the local dev server:
```bash
npm start
```
Navigate to `http://localhost:4200/`. The automatic welcome video will play immediately upon opening the page. Once it finishes (or on clicking Skip), the main website is revealed.

### 3. Production Build
To create a production-optimized build:
```bash
npm run build
```
Build artifacts are placed in `dist/growth-marketing-angular/browser/`. All chunks are tree-shaken, minified, and hashed for production deployment.

### 4. Running Unit Tests
Execute the unit test suite:
```bash
npm test -- --watch=false
```
All 27 unit tests across 9 test files are configured with Vitest and test runner `@angular/build:unit-test`.

---

## 🎬 Welcome Video Intro Behavior

1. **Initial Fresh Load:**
   - Overlay mounts over the entire screen (`100vw`, `100dvh`, fixed, `z-index: 99999`).
   - A clean branded white loading surface displays while the video preloads to avoid flashing the underlying site.
   - Video autoplays muted according to browser standards.
2. **Video Playback & Layout:**
   - Sharp foreground video rendered with `object-fit: contain` (no character cropping or distortion).
   - Desktop and tablet screens display a softly blurred ambient background mirror video with subtle brand radial glow.
   - Mobile screens display the full video centered with safe-area insets.
3. **Completion & Transition:**
   - Once video playback reaches the end (`ended` event), a smooth 600 ms fade-out transition is triggered.
   - The overlay is cleanly removed from the DOM (`@if (!isActive())`), body scrolling is unlocked, and no invisible layer intercepts clicks.
4. **Client-Side Navigation:**
   - Navigating via Angular Router between `/`, `/about`, `/services`, and `/blog` does **not** replay the intro.
   - A browser refresh (F5) or direct navigation to any URL re-triggers the intro as expected for a fresh page load.

## Google Sheets and Vercel setup

1. In [Google Cloud Console](https://console.cloud.google.com/), select or create a project. Under **APIs & Services > Library**, enable the **Google Sheets API**.
2. Under **IAM & Admin > Service Accounts**, create a service account. No project-wide role is needed for access granted through the spreadsheet sharing dialog. Select the account and choose **Keys > Add key > Create new key > JSON**. Use the JSON key's `client_email` and `private_key` in Vercel. [Google service account key instructions](https://cloud.google.com/iam/docs/keys-create-delete)
3. In Google Sheets, share the Blogs spreadsheet with the service account as **Viewer** and the Enquiries spreadsheet as **Editor**. Set **General access** for Enquiries to **Restricted**. Give the Preview service account access to test copies of the sheets and use separate Preview and Production Redis databases.
4. Create an Upstash Redis database for each environment. Copy its REST URL and read/write token from the database dashboard. [Upstash Redis REST credentials](https://upstash.com/docs/redis/features/restapi)
5. In **Vercel > Project > Settings > Environment Variables**, set the variables below for **Preview** first and use the test spreadsheet IDs. After validation, set the Production values separately. Keep the private key and Redis token in Vercel's secret settings. [Vercel environment variables](https://vercel.com/docs/environment-variables)

| Variable | Value |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` from the service account JSON |
| `GOOGLE_PRIVATE_KEY` | `private_key` from that JSON, including the PEM header and footer. Actual or escaped line breaks are accepted. |
| `GOOGLE_BLOG_SHEET_ID` | Blog spreadsheet ID for the selected environment. |
| `GOOGLE_ENQUIRY_SHEET_ID` | Private enquiries spreadsheet ID for the selected environment. |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis HTTPS REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis read/write REST token |

Use Node.js 24 in the Vercel project. Keep Vercel's system environment variables exposed to the functions for trusted request IP detection. The repository sets the Angular build command and browser output directory in `vercel.json`. For local end-to-end testing, link to the Vercel project and run `npx vercel dev` with the Development variables pointed at test resources. The Angular development server by itself provides the frontend only.

### Publish articles

Put these headers on row 1 of the `Blogs` tab.

```text
id, slug, title, excerpt, content, category, cover_image_url, author, published_at, status, featured, meta_title, meta_description
```

Use a stable unique ID and a lowercase hyphenated slug such as `how-to-plan-a-campaign`. Give the row a title and full article content, then enter the publication date in ISO format (`2026-11-27` or `2026-11-27T10:30:00+05:30`). Format that column as plain text or display the date in ISO format. Use blank lines for paragraphs in the content cell. The reader displays content as escaped plain text. Enter an HTTPS image URL for the cover. Mark `featured` TRUE to prioritize the article in the home preview.

Set `status` to `PUBLISHED` to list the article and `DRAFT` to hide it. The API skips rows missing a valid slug, date, ID, title or content. If two published rows share a slug the newest wins. Dates sort newest first, and opening an article gives it a shareable URL such as `/blog?article=how-to-plan-a-campaign`. The browser uses the article's meta fields for its title and description, with the title and excerpt as fallbacks. JavaScript must run to see article-specific metadata.

The function caches published rows for 60 seconds per warm instance, and the Vercel CDN can cache successful responses for another 30 seconds. Reload or revisit the blog after about 90 seconds to verify changes. Sheet edits work without a new deployment. Add any sample articles you want to retain to the Blogs sheet before launch.

### Receive enquiries

Put these headers in this order on row 1 of the private `Enquiries` tab.

```text
timestamp, lead_id, name, phone, email, business_name, service, message, source_page, status
```

The consultation form sends validated fields to `POST /api/enquiries`. The function adds a UTC timestamp, a UUID, the source page `/` and status `New`. Sheets receives the row using `RAW` so user input remains literal text. The response contains a success flag only after a confirmed append or a previously confirmed duplicate. The form retains input on failure and resets after success.

An empty honeypot, same-origin browser requests, and a shared limit of five attempts per client IP in ten minutes reduce spam. Redis stores hashed fingerprints and lead IDs for up to 24 hours to prevent duplicate rows across function instances. If Sheets reports an ambiguous outcome, a retry checks column B for the reserved lead ID. If the ID is still absent, the submission remains unconfirmed and is guarded against a second append for the remainder of the 24-hour window.

### Preview and verify

- Run `npm run build`, `npm test -- --watch=false` and `npm run test:api`.
- Install Chromium with `npx playwright install chromium`, then run `npm run test:browser` against the built Angular bundle. The automated tests use simulated Google Sheets and Redis responses.
- Review the draft PR and open its Vercel Preview after adding Preview variables. Confirm `/api/blogs` returns JSON and a draft returns 404 on `/api/blogs?slug=your-draft-slug`. Add a new published row, wait for the cache window and verify that it appears on refresh without a deploy. Open a direct article URL and inspect the page title and description after it loads.
- Submit a synthetic enquiry twice with identical fields. Verify a single new row, the timestamp, UUID, service, source page and status, then test an invalid submission and confirm the sheet is still restricted. Test a text value that starts with `=` and verify it appears literally.
- Confirm the production branch is `website-v2-branch` and scope Production variables to that environment. Use the approved PR merge to trigger the production deployment after Preview validation.
