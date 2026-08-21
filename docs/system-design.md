# System design — K K Designers

Engineering design for the live product (React SPA + FastAPI + Mongo). Local run and container files are in [../infra/README.md](../infra/README.md). Production serverless and DNS are in [prod-serverless.md](prod-serverless.md).

---

## 1. Purpose

A high-converting portfolio for **K K Designers** (Pune). Visitors must:

1. Trust that a 3D render matches the finished site (compare sliders).
2. Understand turnkey process (raw → handover).
3. Leave a consultation lead (mailto + silent Mongo backup).
4. Let the studio review leads on a private `/admin` page.

This is a **single-tenant marketing system**, not a website builder.

---

## 2. Context (C4 — system)

```
                    ┌─────────────┐
                    │   Visitor   │
                    └──────┬──────┘
           HTTPS           │
     ┌─────────────────────┼──────────────────────┐
     │                     ▼                      │
     │            Edge (CDN / LB / Cloud Run)     │
     │                     │                      │
     │         ┌───────────┴───────────┐          │
     │         ▼                       ▼          │
     │   Web (static SPA)        API (FastAPI)    │
     │   /  /admin               /api/*           │
     └─────────┬───────────────────────┬──────────┘
               │                       │
               │                       ▼
               │                 MongoDB (private)
               │                 collection: enquiries
               ▼
     Behold (feeds.behold.so)   — Instagram tiles, browser-side
     Mail client (mailto:)      — visitor's own device
```

**Trust boundary:** Mongo and `ADMIN_DASH_KEY` never leave the API process. The founder photo and other static assets are public HTTPS objects (see §7).

---

## 3. Containers

| Container | Tech | Scale unit | State |
| --- | --- | --- | --- |
| Web | nginx + CRA build, or S3/Cloud Storage | Many replicas / CDN | Stateless |
| API | FastAPI + Uvicorn | Horizontal (Cloud Run / Fargate / HPA) | Stateless |
| Database | MongoDB (Atlas in prod) | Primary + replicas (managed) | Durable enquiries |
| Instagram adapter | Behold JSON | SaaS | Not our infra |

Compose locally: `web` :8080, `api` :8000, `mongo` :27017. nginx on web proxies `/api` → api so the browser uses one origin.

---

## 4. Components (web)

```
App
 ├─ /          Home: Navbar, Hero, Ribbon, About, Services,
 │             Portfolio, Philosophy, Contact, InstagramFeed, Footer
 └─ /admin     Admin (passcode → enquiry cards)
```

| Component | Talks to |
| --- | --- |
| `Contact` | `POST /api/enquiry` (fire-and-forget) + `mailto:` |
| `Admin` | `GET /api/enquiries` + header `X-Admin-Key` |
| `InstagramFeed` | `GET https://feeds.behold.so/{id}` if env set |
| Others | `data.js` only (no API) |

---

## 5. API surface

| Method | Path | Public? | Auth |
| --- | --- | --- | --- |
| POST | `/api/enquiry` | yes | none (rate-limit in prod) |
| GET | `/api/enquiries` | yes | `X-Admin-Key` == `ADMIN_DASH_KEY` |
| GET | `/api/` | optional | none |
| GET | `/api/media/grant` | yes | none — returns one-shot token |
| GET | `/api/media/i/{token}` | yes | valid unused token |
| * | `/api/status` | **no** | leftover — do not publish |

**Enquiry document**

```
{ id, name, phone, location, project_type, style, created_at }
```

---

## 6. Sequences

### 6.1 Lead capture

```
Visitor → Contact form submit
  ├─ POST /api/enquiry → API → insert enquiries
  └─ location = mailto:kkdesigners15@gmail.com?...
Studio → GET /admin → enter passcode
       → GET /api/enquiries (X-Admin-Key) → cards
```

### 6.2 Read path (marketing)

```
Visitor → GET /  (HTML/JS/CSS/images from CDN or nginx)
       → optional GET Behold feed
```

---

## 7. Quality attributes

| Attribute | Choice |
| --- | --- |
| Availability | Stateless web/api; Atlas multi-AZ |
| Scale | CDN for static; API scales to zero on Cloud Run |
| Security | HTTPS only; admin header; Mongo private; CORS allow-list |
| Privacy (portrait) | File is **not** in `/public`. API issues a 45s one-shot token (`GET /api/media/grant` then `GET /api/media/i/{token}`). The page paints a `blob:` URL, so CSS/Network do not show `/founder.jpg`. Guessing `/founder.jpg` is 404. A copied token URL dies after first use or expiry. Screenshots and a saved Network response still possible — browsers cannot DRM a displayed photo |
| Cost | Serverless containers + Atlas M0/M10 is enough for this traffic |

---

## 8. Deployment views

| Environment | How |
| --- | --- |
| Laptop | Docker Compose — [../infra/README.md](../infra/README.md) §1 |
| Prod (preferred) | Serverless containers + custom domain — [prod-serverless.md](prod-serverless.md) |
| Existing cluster | Kubernetes + HPA — `infra/k8s` |

Same Docker images (`infra/backend/Dockerfile`, `infra/frontend/Dockerfile`) in every environment.
