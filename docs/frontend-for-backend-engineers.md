# Frontend primer for backend engineers

This repo’s visitor UI is **not** FastAPI templates. It is a **React** app built by **Node.js** tools (**Yarn** / **webpack**). You already know the API (`backend/server.py`). This page maps that mental model onto the frontend: concepts, commands, packages, and how React replaces hand-written HTML/CSS files.

Related: [architecture.md](architecture.md) · [system-design.md](system-design.md) · [infra local run](../infra/README.md)

---

## 1. Map it to what you already know

| Backend world | This frontend |
| --- | --- |
| Python runtime | **Node.js** — runs build tools and the dev server (not the visitor’s browser) |
| `pip` + `requirements.txt` / lock | **Yarn** (or npm) + `package.json` + `yarn.lock` |
| `uvicorn server:app` | `yarn start` — webpack dev server on :3000 |
| `gunicorn` + static files | `yarn build` → `frontend/build/` (HTML/JS/CSS the browser actually loads) |
| FastAPI route handler | **React component** (a JS function that returns UI) |
| Jinja / `index.html` | Almost empty `public/index.html` + `<div id="root">`. React **renders** the rest |
| Pydantic model | Props + `useState` (in-memory UI state) |
| `httpx` / `requests` | `fetch` or `axios` from the **browser** |
| `pip install foo` | `yarn add foo` |

**Important:** Node/Yarn do **not** serve the live site to customers. They **compile** JSX + Tailwind into static assets. The browser runs JavaScript. Your FastAPI process is still the real backend.

```
You (engineer)
  yarn start  →  Node/webpack  →  http://localhost:3000
                                      │
Visitor browser                       │  GET /  (index.html + JS bundle)
  React runs in the tab  ─────────────┘
  fetch("/api/enquiry")  →  FastAPI (Python)
```

---

## 2. What Node, npm, Yarn, and React are

### Node.js

A JavaScript runtime **on your laptop / CI**, like CPython. Used here to:

- install packages
- run webpack (`react-scripts` / CRACO)
- start the hot-reload dev server

Check: `node -v` (this project expects **20.x**).

### npm vs Yarn

Both install packages from the npm registry.

| | npm | Yarn 1 (this repo) |
| --- | --- | --- |
| Manifest | `package.json` | same file |
| Lockfile | `package-lock.json` | `yarn.lock` |
| Install | `npm install` | `yarn install` |
| Add dep | `npm install lodash` | `yarn add lodash` |

This app **must use Yarn**. `package.json` has a `resolutions` block (Yarn-only). Plain `npm install` can hoist the wrong `ajv` and break CRACO.

Use: `npx yarn@1.22.22 install` if Yarn is not installed globally.

### React

A **UI library** (people say “framework”). You write **components** in JS/JSX. React’s job:

1. Keep a tree of UI in memory (virtual DOM).
2. When state changes (`setState`), **re-render** only what changed.
3. Patch the real browser DOM.

You do **not** maintain `about.html` + `about.css` + `about.js` by hand. One `About.jsx` describes structure (`<section>`), look (`className="..."`), and behavior (`useEffect` + `fetch`).

**JSX** looks like HTML inside JavaScript. It is **not** sent to the browser as JSX. Babel (inside `react-scripts`) turns:

```jsx
<h2 className="font-serif">Meet Akshada</h2>
```

into:

```js
React.createElement("h2", { className: "font-serif" }, "Meet Akshada");
```

### Tailwind CSS (how we avoid writing CSS files)

`className="py-28 text-[#1A1A1A]"` is a **utility class**. Tailwind’s build step scans those strings and emits **one** CSS file with only the classes you used. You still *style* the page — you just do it next to the markup instead of a separate `.css` per page.

`frontend/src/index.css` is the global entry (`@tailwind base/components/utilities`). Almost no custom layout CSS lives there.

---

## 3. Commands you will actually run

Run these from **`frontend/`** unless noted. Analogy: `cd` into the service directory before `uvicorn`.

### Everyday

```bash
cd frontend

# 1) Install all packages listed in package.json (like pip install -r)
npx yarn@1.22.22 install

# 2) Dev server — like uvicorn --reload. Opens http://localhost:3000
#    Watches files; browser refreshes. setupProxy.js forwards /api → :8000
npx yarn@1.22.22 start

# 3) Production bundle → frontend/build/  (like compiling a wheel + static assets)
npx yarn@1.22.22 build

# 4) Jest unit tests (rarely used in this repo)
npx yarn@1.22.22 test
```

`package.json` `"scripts"` map names to real commands:

| Script | Real command | What it does |
| --- | --- | --- |
| `yarn start` | `craco start` | webpack-dev-server + React refresh |
| `yarn build` | `craco build` | minified JS/CSS with hashed filenames |
| `yarn test` | `craco test` | Jest |

**CRACO** (`@craco/craco`) is a thin wrapper around Create React App so we can add the `@` path alias and Emergent visual-edits without ejecting webpack config.

### Add / remove a package (examples)

```bash
cd frontend

# Runtime dependency (ships in the bundle if imported)
yarn add date-fns

# Dev-only (linters, Tailwind compiler)
yarn add -D some-eslint-plugin

# Remove
yarn remove date-fns
```

Then **import and use** it (otherwise it is dead weight, like an unused pip package):

```js
import { format } from "date-fns";
format(new Date(), "dd MMM yyyy");
```

### Env vars (CRA rule)

Only variables prefixed with `REACT_APP_` are visible in browser code. They are **inlined at build time**, not read from the server at request time.

```bash
# .env in frontend/  (not committed)
REACT_APP_BACKEND_URL=https://api.example.com
REACT_APP_BEHOLD_FEED_ID=

# Then rebuild — changing .env without rebuild does nothing in production
yarn build
```

In code: `process.env.REACT_APP_BACKEND_URL` (see `Contact.jsx`, `Admin.jsx`, `About.jsx`).

### Full stack without learning webpack

From **repo root** (you already know Docker):

```bash
docker compose -f infra/docker-compose.yml up --build
```

That runs nginx (static React build) + FastAPI + Mongo. You never type `yarn` if you only care about the API.

---

## 4. How React replaces HTML + CSS files

Classic site:

```
about.html   +  about.css   +  about.js
contact.html +  contact.css +  contact.js
```

This site:

```
public/index.html          ← shell only: <div id="root"></div>
src/index.js               ← ReactDOM.createRoot(...).render(<App />)
src/App.js                 ← routes: "/" and "/admin"
src/components/kk/*.jsx    ← each "page section" is a component
src/index.css              ← Tailwind + a few globals
```

`index.js` is the equivalent of `if __name__ == "__main__"`: it mounts `<App />` into `#root`. After that, **JavaScript generates the HTML**.

### Example — a FastAPI-shaped component

Backend:

```python
@app.get("/about")
def about():
    return templates.TemplateResponse("about.html", {"name": "Akshada"})
```

Frontend (`About.jsx` idea):

```jsx
export default function About() {
    const name = "Akshada";           // like template context
    return (
        <section id="about">          // like about.html
            <h2>Meet {name}</h2>      // interpolation
        </section>
    );
}
```

State + HTTP (you already do this with FastAPI):

```jsx
const [items, setItems] = useState([]);   // like a local variable that triggers re-render

useEffect(() => {                         // like startup / on-load
    fetch("/api/enquiries", { headers: { "X-Admin-Key": key } })
        .then((r) => r.json())
        .then((d) => setItems(d.enquiries));
}, []);                                   // [] = run once, like @app.on_event("startup")
```

When `setItems` runs, React **re-runs the function** and updates the DOM. You do not write `document.getElementById(...).innerHTML = ...`.

### Styling without a CSS file per section

Instead of:

```css
/* about.css */
.about { padding: 7rem 0; }
```

you write:

```jsx
<section className="py-28 lg:py-36">
```

`py-28` = padding-y, `lg:py-36` = larger padding from the `lg` breakpoint. That is Tailwind. The **framework** (React + Tailwind pipeline) emits the CSS.

You *can* still write CSS (`App.css`, `index.css`). This project mostly chooses not to, except fonts, Lenis, and CSS variables.

---

## 5. Packages in *this* repo — what we actually use

`package.json` is bloated (Emergent template). **Product code** (`src/components/kk/`) only needs a subset.

### Used by K K Designers UI

| Package | Role | Where | Tiny example |
| --- | --- | --- | --- |
| `react` / `react-dom` | UI runtime + mount | every `.jsx` | `export default function Foo() { return <div />; }` |
| `react-router-dom` | URLs like FastAPI `APIRouter` | `App.js` | `<Route path="/admin" element={<Admin />} />` |
| `framer-motion` | enter/hover animation | `Reveal.jsx`, Hero | `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />` |
| `lenis` | smooth scroll | `App.js` | `new Lenis({ lerp: 0.09 })` |
| `react-compare-slider` | before/after drag | `CompareSlider.jsx` | `<ReactCompareSlider itemOne={…} itemTwo={…} />` |
| `react-fast-marquee` | ticker | `Ribbon.jsx` | `<Marquee>PASSION OVER PROFESSION</Marquee>` |
| `lucide-react` | icons | Contact, Admin | `import { Mail } from "lucide-react"; <Mail size={16} />` |
| `@tanstack/react-query` | cached GET (wired, unused by kk) | `index.js` | wrap app in `QueryClientProvider` |

### Used for HTTP in product code

The live site uses **browser `fetch`**, not axios:

```js
fetch(`${API}/enquiry`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
```

`axios` is installed (template). To use it instead:

```js
import axios from "axios";
await axios.post("/api/enquiry", payload);
```

Same as `httpx.AsyncClient().post(...)`.

### Installed but unused by `kk/` (template leftovers)

You can ignore these until you import them: most `@radix-ui/*` (shadcn kit under `src/components/ui/`), `recharts`, `react-hook-form`, `zod`, `swr`, `vaul`, calendar/OTP, etc.

They are like extra entries in `requirements.txt` that `server.py` never imports. They still get **downloaded**; unused ones are mostly tree-shaken out of the **production** bundle if never imported. `index.js` does import React Query, so that stays.

---

## 6. How to use a *different* package (recipe)

Goal: show a toast when an enquiry POST succeeds.

```bash
cd frontend
yarn add sonner          # already in package.json — skip if present
```

```jsx
// somewhere near App
import { Toaster, toast } from "sonner";

// in App.js return:
<Toaster />

// in Contact.jsx after fetch ok:
toast.success("Enquiry saved");
```

That is the whole loop: **add → import → render/call**. No HTML file, no extra CSS file (the library ships styles or you use Tailwind).

Another example — routing (already done):

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/admin" element={<Admin />} />
  </Routes>
</BrowserRouter>
```

Same idea as:

```python
app.include_router(home.router)
app.include_router(admin.router, prefix="/admin")
```

except the “router” runs **in the browser** (client-side). `/admin` does not hit FastAPI unless `Admin.jsx` calls `/api/...`.

---

## 7. Request path: browser → your API

| File | Call | Your FastAPI |
| --- | --- | --- |
| `Contact.jsx` | `POST /api/enquiry` | `create_enquiry` |
| `Admin.jsx` | `GET /api/enquiries` + `X-Admin-Key` | `list_enquiries` |
| `About.jsx` | `GET /api/media/grant` then `/api/media/i/{t}` | tokenized portrait |
| `InstagramFeed.jsx` | `GET https://feeds.behold.so/...` | not your API |

Dev:

- `yarn start` + `setupProxy.js` → `/api` proxied to `http://127.0.0.1:8000` (like nginx `proxy_pass`).
- Docker: nginx on :8080 proxies `/api` to the `api` container.

You still run uvicorn (or the `api` container) yourself.

---

## 8. Mental model of the file tree

```
frontend/
  package.json          # dependencies + scripts   ≈ pyproject/requirements
  yarn.lock             # exact versions           ≈ poetry.lock
  public/index.html     # empty shell
  src/index.js          # process entry
  src/App.js            # composition + routes
  src/components/kk/    # product (read this first)
  src/components/ui/    # unused shadcn copies
  src/index.css         # Tailwind entry
  src/setupProxy.js     # /api → :8000 in yarn start
```

Start reading: `App.js` → `Contact.jsx` (you already know that POST body) → `Admin.jsx`.

---

## 9. Cheat sheet

```bash
# tools
node -v
npx yarn@1.22.22 -v

# frontend
cd frontend && yarn install && yarn start     # UI :3000, needs API :8000 for portrait/admin
cd frontend && yarn add <pkg>                 # new library
cd frontend && yarn build                     # static files for nginx/S3/Cloud Run

# backend (you already know this)
cd backend && uvicorn server:app --reload --port 8000

# both via Docker
docker compose -f infra/docker-compose.yml up --build
```

**React does not delete HTML or CSS.** It generates HTML at runtime and (with Tailwind) generates CSS at build time, so you maintain **components** instead of parallel `.html` / `.css` trees.
