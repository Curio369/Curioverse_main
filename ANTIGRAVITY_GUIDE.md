# 🚀 Antigravity Vibe Coding Guide

> A practical guide to using Google Antigravity effectively for web development — written for the CurioVerse project.

---

## 📌 What is Antigravity?

Antigravity is Google's AI-powered coding assistant (IDE). It uses Gemini models to write code, debug, design, and build entire projects through conversation. Think of it as having a senior developer sitting next to you 24/7.

---

## 💳 Understanding Daily AI Credits

Antigravity doesn't use simple "X requests per day" limits. Here's how it actually works:

### How the Quota System Works

| Concept | What It Means |
|---------|--------------|
| **"Work Done" metric** | You're charged based on *complexity* of tasks, not just message count |
| **5-Hour Sprint Limit** | A short-term quota that resets every ~5 hours |
| **Weekly Baseline** | A broader weekly limit sits on top of the 5-hour cycles |
| **AI Credits Toggle** | In Settings → you can opt into a credit-based top-up system |

### ⚡ How to Save Credits (The Big Ones)

1. **Be specific in your prompts** — "Add a dark mode toggle to the navbar in `index.html`" burns way less than "make my website better"
2. **Don't repeat yourself** — If the AI already made a change, don't ask for it again. Say "that looks good, now do X"
3. **Batch related changes** — Instead of 5 separate requests, say "Do all of these: 1) fix navbar, 2) add footer, 3) update colors"
4. **Use smaller models for simple tasks** — Gemini Flash is cheaper for basic edits; save Gemini Pro for complex logic
5. **Don't ask it to rewrite entire files** — Say "change line 45 to do X" instead of "rewrite the whole function"
6. **Use agent skills** — Skills give the AI pre-built instructions, so it doesn't waste tokens figuring out *how* to do something
7. **Plan before executing** — Ask for a plan first, approve it, then let it execute. Avoids costly redo cycles
8. **Keep conversations focused** — One topic per conversation. Don't mix "fix bug" with "redesign page"

### 🚫 What Eats Credits Fast

- Asking vague questions like "improve everything"
- Having the AI read huge files repeatedly (use specific line ranges)
- Cancelling and re-asking the same thing
- Browser automation (opening pages, screenshots) — these are expensive operations
- Generating images — each image generation costs significant tokens

---

## 🧩 What Are Agent Skills?

Skills are **markdown instruction files** that teach the AI how to perform specific tasks better. Instead of the AI guessing how to do something, skills give it a proven playbook.

Think of them as:
> **Cheat sheets for the AI** — they make it smarter at specific tasks without you having to explain everything.

### Your Installed Skills (12 total)

These are in your `.agent/skills/` folder:

| Skill | What It Does | When to Use |
|-------|-------------|-------------|
| **3d-web-experience** | Three.js, WebGL, 3D model integration, performance | When adding 3D elements to your site |
| **canvas-design** | Design philosophy creation, aesthetic movements | When planning a visual direction/theme |
| **concise-planning** | Generates actionable checklists from requests | Before starting any complex task |
| **frontend-design** | Premium, distinctive UI creation (not generic layouts) | When building memorable, high-craft interfaces |
| **javascript-pro** | ES6+, async/await, Node.js, promises, event loops | For any JS logic, debugging, or optimization |
| **lint-and-validate** | Runs validation after every code change | After ANY code change (should be automatic) |
| **mcp-builder** | Creating MCP servers for AI tool integration | When building custom AI tools |
| **mobile-design** | Mobile-first, touch-first responsive design | When making your site work on phones |
| **scroll-experience** | Scroll-driven animations, parallax, GSAP triggers | When adding scroll-based effects |
| **seo-audit** | SEO diagnostics, crawlability, rankings | Before deploying to check SEO health |
| **systematic-debugging** | 4-phase root cause analysis before fixing bugs | When something breaks — use BEFORE randomly fixing |
| **ui-ux-pro-max** | 50+ styles, 97 color palettes, 57 font pairings, UX rules | When designing any UI component or page |

### How Skills Save You Credits

Without skills, this is what happens:
```
You: "Make a scroll animation for my hero section"
AI: *spends 20+ tool calls researching how to do scroll animations, 
     trying different approaches, reading docs...*
```

With the `scroll-experience` skill installed:
```
You: "Make a scroll animation for my hero section"  
AI: *already knows GSAP ScrollTrigger patterns, immediately writes 
     production code in 3-4 tool calls*
```

**Skills = fewer tokens = more work done per day.**

### Where Your Skills Came From

These were installed from [antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) — a library of **1,329+ free skills** for AI coding assistants.

To install more skills:
```bash
npx antigravity-awesome-skills
```

---

## 🔌 What Are MCP Servers?

MCP (Model Context Protocol) servers are **plugins that give the AI superpowers** beyond just reading/writing code. They connect the AI to external tools and services.

### Your Installed MCP Server: Stitch

**Stitch** is Google's UI design tool integrated directly into Antigravity. It lets the AI:

| Capability | What You Can Say |
|-----------|-----------------|
| **Generate screens** | "Create a login page design" |
| **Edit existing screens** | "Make the header bigger on screen X" |
| **Create design systems** | "Set up a dark theme with golden accents" |
| **Apply design systems** | "Apply my design system to all screens" |
| **Generate variants** | "Show me 3 different versions of this page" |
| **Manage projects** | "List my Stitch projects" |

### How to Use Stitch Effectively

```
You: "Create a Stitch project called CurioVerse and generate a 
      homepage screen with a dark theme, golden accents, and a 
      hero section with 3D elements"
```

Stitch will generate actual UI designs that you can then export or use as reference for coding.

---

## 🛠️ More Things You Can Add to Antigravity

### More MCP Servers Worth Installing

| MCP Server | What It Does | Best For |
|-----------|-------------|----------|
| **GitHub MCP** | Manage repos, PRs, issues from chat | Git workflow without leaving the IDE |
| **Figma MCP** | Read Figma designs and convert to code | Design-to-code workflows |
| **Supabase MCP** | Database management, auth, storage | Backend-as-a-service |
| **Brave Search MCP** | Web search from within the IDE | Research without switching tabs |
| **Filesystem MCP** | Advanced file operations | Complex file management |
| **Puppeteer MCP** | Browser automation and testing | Automated testing, screenshots |
| **Notion MCP** | Read/write Notion docs | Project management integration |

### More Skills Worth Installing

From the [antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) repo, these are especially useful for web development:

| Skill | Why You'd Want It |
|-------|------------------|
| `@brainstorming` | Planning before implementation |
| `@architecture` | System and component design |
| `@test-driven-development` | TDD workflows |
| `@create-pr` | Clean pull request packaging |
| `@api-design-principles` | Good API design |
| `@security-auditor` | Security-focused code reviews |
| `@copywriting` | Better text content and CTAs |
| `@landing-page-design` | Conversion-optimized page layouts |
| `@docker-expert` | Containerization for deployment |
| `@vercel-deployment` | Deploy to Vercel seamlessly |

Install specific skills:
```bash
npx antigravity-awesome-skills --skills frontend-design,scroll-experience,brainstorming
```

Or install a bundle (curated group):
```bash
npx antigravity-awesome-skills --bundle frontend-starter
```

---

## 🎨 Vibe Coding Tips for Web Development

### The Golden Rules

1. **Start with a plan, not code**
   ```
   "I want to add a contact form. Give me a plan first, 
    don't write any code yet."
   ```

2. **Reference specific files and lines**
   ```
   ✅ "In script.js around line 620, change the API key handling"
   ❌ "Fix that thing in the JavaScript"
   ```

3. **Use your skills by name**
   ```
   "Using the scroll-experience skill, add a parallax 
    effect to the hero section"
   ```

4. **Iterate in small steps**
   ```
   Step 1: "Add the HTML structure for a contact form"
   Step 2: "Now style it with CSS to match our dark theme"
   Step 3: "Add JavaScript validation"
   ```
   
   This is cheaper and more controllable than: "Build a complete contact form with styling, validation, and backend"

5. **Don't ask for explanations unless you need them**
   ```
   ✅ "Add a loading spinner to the search button"
   ❌ "Explain what a loading spinner is and then add one"
   ```

### What to Ask vs What to Do Yourself

| Let the AI Handle | Do It Yourself |
|-------------------|---------------|
| Writing boilerplate code | Choosing your color palette |
| Debugging complex issues | Deciding what features to build |
| CSS animations and 3D math | Writing your personal bio text |
| Cross-browser compatibility | Selecting which images to use |
| SEO optimization | Choosing your domain name |
| Performance tuning | Setting up hosting/deployment accounts |

### Prompt Templates That Save Tokens

**For new features:**
```
Add [feature] to [file]. It should [behavior]. 
Match the existing style in [reference file/section].
```

**For bug fixes:**
```
In [file] at line [N], [what's happening] but it should [expected behavior].
```

**For styling:**
```
Style [element] to match [reference]. Use CSS variables 
from our existing design system in style.css.
```

**For refactoring:**
```
Refactor [function/section] in [file] to [improvement]. 
Keep the same behavior, just make it [cleaner/faster/more readable].
```

---

## 📁 Your Project Setup

```
Main_web/
├── index.html          ← Main page structure
├── style.css           ← All styles and animations
├── script.js           ← All JavaScript logic
├── .env                ← Your API keys (git-ignored, NEVER commit)
├── .env.example        ← Template for other devs
├── .gitignore          ← Keeps secrets and junk out of git
├── .agent/skills/      ← 12 AI skills installed
├── ai_updates_log.md   ← Log of AI-made changes
└── ANTIGRAVITY_GUIDE.md ← This file
```

### Security Reminder

- ✅ `.env` is in `.gitignore` — your keys are safe
- ✅ `script.js` uses `YOUR_KEY_HERE` placeholder — no keys exposed
- ✅ `.env.example` shows what keys are needed without exposing values
- ⚠️ Never hardcode API keys directly in HTML, JS, or CSS files
- ⚠️ If you add new API keys, put them in `.env` first

---

## 🧠 Quick Reference Card

| I Want To... | Say This |
|-------------|----------|
| Save credits | "Be concise. Don't explain, just do it." |
| Plan first | "Give me a plan before writing any code." |
| Use a skill | "Using the [skill-name] skill, do X" |
| Debug properly | "Use systematic-debugging to investigate this issue" |
| Design UI | "Use ui-ux-pro-max to design a [component]" |
| Add 3D | "Use 3d-web-experience to add [effect]" |
| Check SEO | "Use seo-audit to check my index.html" |
| Generate UI design | "Create a Stitch screen for [page description]" |
| Batch edits | "Do all of these in one go: 1)... 2)... 3)..." |

---

*Last updated: March 28, 2026*
