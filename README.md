# SHUBH AI

Exploring Artificial Intelligence & Building Intelligent Solutions

An independent AI learning website and portfolio by Shubham Pandey, Full Stack Developer in Gorakhpur, Uttar Pradesh, India.

## Features and stack

- Original AI learning guides and journal articles
- Developer profile, skills, and demonstrable project cards
- Browser-local text analyzer and site-only chatbot with optional Groq replies
- Five-slide featured gallery, application and case study carousels, and a 29-entry searchable catalog
- Illustrated technology and industry tabs, article sidebars, private browser notes, and FAQ accordions
- Responsive navigation, keyboard support, reduced-motion styling, and a custom SVG mark
- Contact form with native field validation, submission status, timeout handling, and Formspree spam filtering
- Static HTML, CSS, and JavaScript. No build step or runtime packages.

## Page map

| Route | Connects to |
| --- | --- |
| `index.html` | AI Learning, text analyzer, journal, and developer portfolio |
| `about.html` | Developer profile, skills, projects, and text analyzer |
| `ai-solutions.html` | AI, machine learning, deep learning, generative AI, and text analyzer |
| `blog.html` | Both articles and external AI update sources |
| `ai-in-the-age-of-intelligent-transformation.html` | Journal and companion article |
| `the-future-of-artificial-intelligence.html` | Journal and companion article |
| `contact.html` | Email, telephone, contact form, and privacy policy |
| `privacy-policy.html` | Contact data handling |
| `term-services.html` | Site use terms and contact page |

Shared navigation links Home, About, AI Learning, Journal, and Contact. The footer links Contact, Privacy Policy, and Terms of Use. The `assets/` folder contains the stylesheet, navigation and tool script, contact script, and logo.

## Preview locally

From this directory run `python -m http.server 8080` and open `http://localhost:8080`. You can also open `index.html` directly for an offline preview.

## Activate Gmail delivery

1. In [Formspree](https://formspree.io/), create a form and link and verify `shubhamgkpp@gmail.com` as the notification recipient.
2. In the form settings, confirm that email notifications use that verified address. Copy the public endpoint in the format `https://formspree.io/f/yourformid`.
3. Replace the placeholder action in `contact.html` with that endpoint. Use the public form URL only. Gmail credentials and private keys belong outside this project.
4. Serve the site locally and submit a clearly labeled test. Confirm the submission appears in Formspree and the notification arrives in Gmail. Check Spam and the notification setting if the dashboard records the test but the inbox does not receive it.
5. Repeat the test from the approved hosted URL once deployed. Update any domain restrictions accordingly.

The form stays disabled until an endpoint is configured. Its success message confirms service acceptance. Gmail delivery is verified separately in the inbox. The [free tier](https://help.formspree.io/articles/account-management/account-limits) starts at 50 submissions per month, supports two linked notification addresses, and exposes 30 days of submissions in the dashboard.

## Deploy after approval

This repository is [SHUBHAM8PANDEY/Shubh_Ai](https://github.com/SHUBHAM8PANDEY/Shubh_Ai). With GitHub Pages enabled, the expected URL is https://shubham8pandey.github.io/Shubh_Ai/.

In GitHub, open **Settings → Pages → Build and deployment**. Select **Deploy from a branch**, choose **main** and **/ (root)**, and click **Save**. After this one-time setup, future pushes to main publish automatically. The site uses relative links and includes `.nojekyll`.

To upload future changes from PowerShell:

```powershell
Set-Location -LiteralPath 'G:\SHUBH-AI'
git status --short
git add -- .gitignore .nojekyll README.md TESTING.md server.mjs *.html assets
git diff --cached --stat
git commit -m "Update SHUBH AI website"
git push origin main
```

The HTML page map above is available before deployment. Once the production URL is known, publish a sitemap.xml with absolute page URLs. If using a custom domain, robots.txt belongs at the domain root and may reference that sitemap. A GitHub project site's subdirectory robots.txt does not control the shared host.

## Screenshots

Capture the homepage at desktop and mobile widths and the contact form after its live delivery test.

## Source provenance

The site code, editorial copy, brand mark, and generated technology images were created for this rebuild. The original-to-rebuild audit is kept locally. Company assets and dependencies from the extracted workspace are excluded. No redistribution license has been selected.

## Run the Groq site chatbot

Use Node.js 24. Revoke any key previously pasted in chat and create a fresh key in the Groq console. In this folder create a local `.env` file with `GROQ_API_KEY=YOUR_NEW_KEY`, then run:

```powershell
node --env-file=.env server.mjs
```

Open http://127.0.0.1:8080/. Without a key, run `node server.mjs` for the site guide. The chatbot recognizes four site topics. General questions are rejected in the browser without an API call. The server accepts only those four topic IDs and sends predefined public facts to Groq. Successful responses are cached per process. There is one concurrent upstream request and a maximum of 12 upstream attempts per UTC day per process, with a 180-token cap per attempt. Restarts reset the in-memory limits. Contact and project links also work with the site guide.

GitHub Pages serves the static site and local chat guide. Use a Node host for Groq and set `GROQ_API_KEY` in its private environment. Set `HOST=0.0.0.0` only when the host requires binding to its container interface. Never upload `.env`. Groq account quotas are separate from the app cap.
