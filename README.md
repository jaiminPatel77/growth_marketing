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
- **Typed Blog System with Future Google Sheets Adapter:** Converts static blog articles into typed TypeScript models (`BlogPost`, `BlogSection`). Supports real-time search, category filtering (All, Marketing, Social Media, Creative), and an article reader modal. Decoupled through `BlogDataSourceAdapter` for seamless Google Sheets integration.
- **Reactive Consultation Form:** Built with Angular Reactive Forms (`FormGroup`, `Validators`). On submission, generates formatted text and copies it to the user's clipboard (`navigator.clipboard` with fallback) alongside an interactive toast notification. The UI explicitly discloses that it is a demo and does not transmit data.
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
│       │   │   └── blog.model.ts                   # BlogPost and BlogSection interfaces
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
│                   └── blog-data.ts                # Local typed blog repository
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
