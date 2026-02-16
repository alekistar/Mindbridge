# MindBridge

MindBridge is a mental-wellness platform designed specifically for teenagers. It provides a safe, curated environment to explore coping strategies, educational videos, and maintain a private journal.

## Features

- **Netflix-style Discovery:** Horizontal scrolling categories (Trending, Guides, Staff Picks) with snap scrolling.
- **Private Journal:** Client-side local storage with "locked" entry visibility and mood tagging.
- **AI Chatbot:** A safety-first assistant powered by Gemini API (requires API Key).
- **Crisis Detection:** Real-time monitoring of journal entries and chat messages for crisis keywords, triggering an immediate resource overlay.
- **Accessible Design:** WCAG-focused color contrast, keyboard navigation, and screen-reader support.
- **Dark Mode:** Fully supported system-wide or user-toggled dark theme.

## Tech Stack

- **Frontend:** React (Create React App / Vite structure equivalent), Tailwind CSS
- **Routing:** React Router DOM (HashRouter for easy static deployment)
- **AI:** Google Gemini API (`@google/genai`)
- **Icons:** Heroicons (SVG)

## Setup & Running Locally

1. **Install Dependencies:**
   ```bash
   npm install react react-dom react-router-dom tailwindcss @google/genai
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   # Optional: Required for Chatbot functionality
   API_KEY=your_gemini_api_key_here
   ```

3. **Run Development Server:**
   ```bash
   npm start
   ```

## Deployment (Vercel/Netlify)

This project is a static React application (SPA).

**Build Command:** `npm run build`
**Output Directory:** `build` (or `dist` depending on bundler)

### Vercel Configuration
1. Import project from Git.
2. Set Framework Preset to "Create React App" or "Vite".
3. Add `API_KEY` to Environment Variables.
4. Deploy.

## Content Management (CMS)

The current content is seeded in `constants.ts`. To integrate a CMS:
1. Replace `TOPICS` and `COLLECTIONS` constants with API calls to Contentful/Sanity.
2. Ensure the data shape matches `Topic` and `Collection` interfaces in `types.ts`.

## Safety & Moderation

- **Crisis Logic:** Located in `constants.ts` (`CRISIS_KEYWORDS`) and `components/Chatbot.tsx`.
- **Journal Privacy:** Entries are stored in `localStorage`. They are **never** sent to a server in this demo version.
- **Disclaimer:** This app is for educational purposes only.

## License

MIT
