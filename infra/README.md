# Deploy K K Designers (Docker, serverless, Kubernetes, cross-cloud)

This folder is the deployment kit. The product is a React SPA plus a small FastAPI service that stores enquiries in MongoDB.

```
Visitor  →  Web (nginx / CDN)  →  GET /
         →  Web /admin         →  GET /admin  (passcode UI)
         →  API gateway/LB     →  POST /api/enquiry      public
                               →  GET  /api/enquiries    header X-Admin-Key
Mongo stays private. Instagram tiles are fetched in the browser from Behold.
```

**Want to run it on your machine?** Start at [Run locally](#1-run-locally-step-by-step).

**Docs:** [system design](../docs/system-design.md) · [AWS / GCP serverless + domain](../docs/prod-serverless.md) · [architecture](../docs/architecture.md)

---

## 1. Run locally (step by step)

There are two ways. Use **A (Docker)** if you want the website + API + Mongo + admin dashboard together. Use **B (Yarn only)** if you only need to look at the UI.

All commands below start from the **repository root** (`Website_builder_kkdesigner/`), not from `infra/`.

### 1.1 Prerequisites

1. Install **Docker Desktop** (Mac/Windows) or Docker Engine (Linux) and leave it running. Check:

   ```bash
   docker version
   docker compose version
   ```

2. Optional (UI-only path B): **Node.js 20** and Yarn 1.

   ```bash
   node -v          # v20.x
   npx yarn@1.22.22 -v
   ```

3. Free these ports: **8080** (site), **8000** (API), **27017** (Mongo), or **3000** for path B.

### 1.2 Option A — full stack with Docker (recommended)

1. Open a terminal and `cd` to the repo root.
2. Start Docker Desktop and wait until it says it is running.
3. Build images and start three containers (web, api, mongo). First build can take a few minutes:

   ```bash
   docker compose -f infra/docker-compose.yml up --build
   ```

   Add `-d` to run in the background:

   ```bash
   docker compose -f infra/docker-compose.yml up --build -d
   ```

4. Wait until you see `healthy` for mongo and the api container is up:

   ```bash
   docker compose -f infra/docker-compose.yml ps
   ```

5. Open the site:
   - Website: http://localhost:8080
   - Admin dashboard: http://localhost:8080/admin
   - Passcode: `kkd-local-admin`
   - API health: http://localhost:8000/api/

6. Confirm an enquiry is stored (optional):

   ```bash
   curl -s -X POST http://localhost:8080/api/enquiry \
     -H 'Content-Type: application/json' \
     -d '{"name":"Test","phone":"737","location":"Pune","project_type":"Apartment","style":"Modern Minimal"}'

   curl -s http://localhost:8080/api/enquiries \
     -H 'X-Admin-Key: kkd-local-admin'
   ```

   You should get `"status":"success"` then a JSON list. A request **without** the header must return **401**.

7. In the browser: fill **Let's Build Your Dream Space**, submit (mail app may open), then refresh `/admin` — the lead should appear.

8. Live Instagram (optional): create a Behold feed id, then rebuild web only:

   ```bash
   REACT_APP_BEHOLD_FEED_ID=your_feed_id \
     docker compose -f infra/docker-compose.yml up --build -d web
   ```

9. Stop everything (keeps the Mongo volume so enquiries survive):

   ```bash
   docker compose -f infra/docker-compose.yml down
   ```

10. Wipe the local database as well:

    ```bash
    docker compose -f infra/docker-compose.yml down -v
    ```

### 1.3 Option B — frontend only (no Docker, no admin data)

Use this when you only need the marketing page and do not care about Mongo.

1. `cd frontend`
2. Install dependencies (this project uses Yarn resolutions; plain `npm install` can break CRACO):

   ```bash
   npx yarn@1.22.22 install
   ```

3. Start the CRA dev server:

   ```bash
   BROWSER=none npx yarn@1.22.22 start
   ```

4. Open http://localhost:3000

The contact form still opens a `mailto:` draft. The silent `POST /api/enquiry` will fail in the browser console unless an API is running and `REACT_APP_BACKEND_URL` points at it. Admin at `/admin` will not load enquiries.

### 1.4 What each Docker service is

| Service | Image / role | Host port |
| --- | --- | --- |
| `web` | nginx + production React build | http://localhost:8080 |
| `api` | FastAPI (`uvicorn`) | http://localhost:8000 |
| `mongo` | MongoDB 7 | localhost:27017 |

nginx on `web` proxies `/api` to `api`, so the browser can call `/api/enquiry` on port **8080** (same origin). Compose sets `REACT_APP_BACKEND_URL` empty at build time for that reason.

### 1.5 If something fails

| Symptom | What to do |
| --- | --- |
| `failed to connect to the docker API` / socket error | Start Docker Desktop, wait ~20s, retry `docker version` |
| Port already in use | Stop the old CRA server on 3000, or change ports in `infra/docker-compose.yml` |
| `web` build fails on `ajv` / CRACO | You used npm in the image; the Dockerfile uses `yarn.lock` — rebuild from a clean tree |
| API exits immediately | `docker compose -f infra/docker-compose.yml logs api` — usually Mongo not healthy yet; wait and `up` again |
| Admin says incorrect passcode | Use `kkd-local-admin` (local compose only). Production uses `ADMIN_DASH_KEY` |
| Site loads, `/api` 502 | API container not up: `docker compose -f infra/docker-compose.yml logs api` |

---

## 2. What must be public on an API gateway

Publish **only** these:

| Method | Path | Who | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/enquiry` | Contact form (silent backup) | none — add rate limit / WAF |
| `GET` | `/api/enquiries` | `/admin` dashboard | `X-Admin-Key` must match `ADMIN_DASH_KEY` |
| `GET` | `/api/` | health | optional |
| `GET` | `/api/media/grant` then `/api/media/i/{token}` | founder portrait | one-shot token, 45s |

Do **not** publish:

- Mongo (`27017`)
- `ADMIN_DASH_KEY`, `MONGO_URL`
- template leftovers `POST/GET /api/status` (lock down or delete)

The website and `/admin` HTML/JS can live on a CDN. The browser calls the API using `REACT_APP_BACKEND_URL`. In Docker we set that empty so the browser uses same-origin `/api`, and nginx proxies to FastAPI (no CORS needed).

On Cloud Run / two hostnames, set:

```
REACT_APP_BACKEND_URL=https://api.example.com
CORS_ORIGINS=https://www.example.com
```

---

## 3. How enquiries are saved (admin page)

This is already in the app (PRD round 5). No extra feature code is required for “save enquiry”.

1. Visitor submits the form in `Contact.jsx`.
2. Browser **fire-and-forget** `POST {REACT_APP_BACKEND_URL}/api/enquiry` with `{ name, phone, location, project_type, style }`.
3. FastAPI writes a document to Mongo `enquiries` (`id`, `created_at`). Email send was removed from this path.
4. Browser still opens a `mailto:` draft to `kkdesigners15@gmail.com`.
5. `/admin` asks for a passcode, then `GET /api/enquiries` with `X-Admin-Key`.
6. Cards render name, phone (`tel:`), location, type, style, date.

Local Docker passcode: `kkd-local-admin` (see `docker-compose.yml`). Change it in every real environment.

---

## 4. Live Instagram feed

`InstagramFeed.jsx` already supports a live grid.

1. Create a free account at [behold.so](https://behold.so).
2. Connect Instagram `@k_k_designers` (the studio owner must log in).
3. Copy the feed id.
4. Set `REACT_APP_BEHOLD_FEED_ID=<id>` at **frontend build time** (CRA inlines env).
5. Rebuild the web image. The browser will `GET https://feeds.behold.so/<id>` and show 6 posts.

If the id is empty or the request fails, curated fallback tiles still link to the Instagram profile.

Official Instagram Graph API is heavier (Meta app, tokens, refresh). Behold is the path this codebase already implements.

Docker:

```bash
REACT_APP_BEHOLD_FEED_ID=your_id docker compose -f infra/docker-compose.yml build web
```

---

## 5. Recommended approach by size

| Situation | Approach |
| --- | --- |
| Local test | `infra/docker-compose.yml` (this folder) |
| Small prod, little ops | **Serverless containers**: GCP Cloud Run or AWS App Runner / ECS Fargate |
| Named public API + quotas | API Gateway (AWS HTTP API or GCP API Gateway) in front of the API container |
| Many replicas, existing cluster | Kubernetes + HPA (`infra/k8s`) |
| AWS **and** GCP | Same Docker images + two Terraform stacks (`infra/terraform`) |

True “function” serverless (AWS Lambda + API Gateway) needs a Mangum wrapper and a Mongo that is reachable from Lambda (Atlas). Same image on Cloud Run is simpler.

**Production walkthrough** (Cloud Run, App Runner, CloudFront, Route 53 / Cloud DNS, TLS, `www` + `api` hostnames): [docs/prod-serverless.md](../docs/prod-serverless.md).

---

## 6. Push the same images to a registry

```bash
docker build -f infra/backend/Dockerfile -t REGION/PROJECT/kk-api:v1 .
docker build -f infra/frontend/Dockerfile -t REGION/PROJECT/kk-web:v1 .
docker push REGION/PROJECT/kk-api:v1
docker push REGION/PROJECT/kk-web:v1
```

Those tags are what Terraform / Kubernetes consume.

---

## 7. Kubernetes scale-out

```bash
kubectl apply -f infra/k8s/namespace.yaml
# copy secret.yaml.example → secret.yaml, edit keys, apply
kubectl apply -f infra/k8s/mongo.yaml
kubectl apply -f infra/k8s/api.yaml -f infra/k8s/web.yaml
kubectl apply -f infra/k8s/ingress.yaml -f infra/k8s/hpa.yaml
```

HPA scales API and web from 2 pods up when CPU > 70%. Mongo is a single StatefulSet — do not scale Mongo by adding random replicas without replica-set config. For production use Atlas / Cloud SQL-adjacent managed Mongo instead of in-cluster Mongo.

---

## 8. Cross-cloud Terraform

See [terraform/README.md](terraform/README.md). Strategy:

- One **image contract**
- One **labels** module
- Separate stacks: `terraform/aws` (ECS + ALB) and `terraform/gcp` (Cloud Run)

You cannot share `aws_lb` with GCP. You share variables and Docker tags.

---

## 9. Env reference

| Variable | Where | Purpose |
| --- | --- | --- |
| `MONGO_URL` / `DB_NAME` | API | Enquiry store |
| `ADMIN_DASH_KEY` | API | Admin list auth |
| `CORS_ORIGINS` | API | Required if web and API hosts differ |
| `REACT_APP_BACKEND_URL` | Web **build** | API origin (`""` = same host `/api`) |
| `REACT_APP_BEHOLD_FEED_ID` | Web **build** | Live Instagram |
| `EMERGENT_EMAIL_KEY` / `OWNER_EMAIL` / `EMAIL_FROM_NAME` | API import | Still required by `server.py` even though enquiry no longer sends mail |
