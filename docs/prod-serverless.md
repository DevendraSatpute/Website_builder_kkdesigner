# Production serverless — AWS / GCP + custom domain

Use the **same Docker images** you already run locally. Prefer **serverless containers** (scale to zero, HTTPS, no cluster). Kubernetes is optional later.

Build once:

```bash
# from repo root
docker build -f infra/backend/Dockerfile -t kk-api:v1 .
docker build -f infra/frontend/Dockerfile \
  --build-arg REACT_APP_BACKEND_URL=https://api.YOUR_DOMAIN \
  --build-arg REACT_APP_BEHOLD_FEED_ID= \
  -t kk-web:v1 .
```

For a **single hostname** (site and API together), set `REACT_APP_BACKEND_URL` empty and put a reverse proxy in front (Cloud Load Balancing / CloudFront + ALB). Compose already does this with nginx.

---

## 1. Target architecture (both clouds)

```
  you@kkdesigners.in          api.kkdesigners.in        (or one host + /api)
           │                            │
           ▼                            ▼
     CDN / HTTPS LB              Serverless API
     (static SPA)                (Cloud Run / App Runner)
           │                            │
           └──────── CORS / same origin ─┘
                                    │
                                    ▼
                             MongoDB Atlas (private IP or IP allow-list)
```

| Piece | AWS | GCP |
| --- | --- | --- |
| Web | S3 + CloudFront **or** App Runner | Cloud Storage + Cloud CDN **or** Cloud Run |
| API | App Runner **or** Lambda + API Gateway | Cloud Run |
| Secrets | Secrets Manager | Secret Manager |
| DNS | Route 53 | Cloud DNS |
| TLS | ACM | Google-managed cert |
| DB | Atlas on AWS | Atlas on GCP |

**Atlas** is the practical database: `server.py` is Motor/Mongo. DocumentDB or Firestore would need code changes.

Do **not** put Mongo on a public `0.0.0.0/0` allow-list. Allow only the NAT / Cloud Run / App Runner egress IPs, or use Atlas Private Endpoint.

---

## 2. GCP — Cloud Run (simplest serverless)

### 2.1 One-time setup

1. Create a GCP project, enable billing.
2. Enable APIs: Cloud Run, Artifact Registry, Cloud DNS (if you host DNS here), Secret Manager.
3. Create a repo and push images:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT
gcloud artifacts repositories create kk \
  --repository-format=docker --location=asia-south1

gcloud auth configure-docker asia-south1-docker.pkg.dev

docker tag kk-api:v1 asia-south1-docker.pkg.dev/YOUR_PROJECT/kk/api:v1
docker tag kk-web:v1 asia-south1-docker.pkg.dev/YOUR_PROJECT/kk/web:v1
docker push asia-south1-docker.pkg.dev/YOUR_PROJECT/kk/api:v1
docker push asia-south1-docker.pkg.dev/YOUR_PROJECT/kk/web:v1
```

4. Create Atlas cluster, database user, and network access for Cloud Run egress (or VPC connector + private endpoint).
5. Store secrets (`MONGO_URL`, `ADMIN_DASH_KEY`, …) in Secret Manager.

### 2.2 Deploy API

```bash
gcloud run deploy kk-api \
  --image=asia-south1-docker.pkg.dev/YOUR_PROJECT/kk/api:v1 \
  --region=asia-south1 \
  --allow-unauthenticated \
  --min-instances=0 \
  --max-instances=8 \
  --port=8000 \
  --set-secrets=MONGO_URL=mongo-url:latest,ADMIN_DASH_KEY=admin-key:latest \
  --set-env-vars=DB_NAME=kkdesigners,EMAIL_FROM_NAME=K\ K\ Designers,OWNER_EMAIL=kkdesigners15@gmail.com,EMERGENT_EMAIL_KEY=unused,CORS_ORIGINS=https://www.YOUR_DOMAIN
```

Note the URL, e.g. `https://kk-api-xxxxx-el.a.run.app`.

### 2.3 Deploy web

Rebuild web with `REACT_APP_BACKEND_URL=https://kk-api-xxxxx-el.a.run.app` **or** the custom API hostname from §4, then:

```bash
gcloud run deploy kk-web \
  --image=asia-south1-docker.pkg.dev/YOUR_PROJECT/kk/web:v1 \
  --region=asia-south1 \
  --allow-unauthenticated \
  --min-instances=0 \
  --port=80
```

Sample Terraform for this shape: `infra/terraform/gcp`.

### 2.4 Connect a domain on GCP

**Option A — Cloud Run domain mapping (fastest)**

1. Buy or already own `YOUR_DOMAIN` (GoDaddy, Google Domains, etc.).
2. Map services:

```bash
gcloud run domain-mappings create --service=kk-web --domain=www.YOUR_DOMAIN --region=asia-south1
gcloud run domain-mappings create --service=kk-api --domain=api.YOUR_DOMAIN --region=asia-south1
```

3. `gcloud` prints DNS records (usually `CNAME` to `ghs.googlehosted.com` or Cloud Run host).
4. In your DNS host (GoDaddy / Cloud DNS):

   | Type | Name | Value |
   | --- | --- | --- |
   | CNAME | `www` | value Google shows |
   | CNAME | `api` | value Google shows |
   | A / AAAA or CNAME | `@` | apex → `www` (ALIAS/ANAME if the registrar supports it) |

5. Wait for TLS (Google provisions the cert; often 15–60 minutes).
6. Rebuild web with `REACT_APP_BACKEND_URL=https://api.YOUR_DOMAIN` and `CORS_ORIGINS=https://www.YOUR_DOMAIN`.
7. Open `https://www.YOUR_DOMAIN` and `https://www.YOUR_DOMAIN/admin`.

**Option B — Global HTTPS Load Balancer (one hostname)**

1. Serverless NEGs for `kk-web` and `kk-api`.
2. URL map: `/api/*` → API NEG, `/*` → web NEG.
3. Google-managed cert on `YOUR_DOMAIN` + `www.YOUR_DOMAIN`.
4. Cloud DNS A/AAAA to the LB IPs.
5. Build web with **empty** `REACT_APP_BACKEND_URL` (same origin `/api`).

Use B if you want visitors to never see a second hostname.

---

## 3. AWS — App Runner + CloudFront (serverless-style)

App Runner runs your containers without ECS/EKS. CloudFront + S3 is even cheaper for the SPA if you split hosts.

### 3.1 Registry and API

1. Create ECR repos `kk-api` and `kk-web` in `ap-south-1`.
2. Push `kk-api:v1` and `kk-web:v1`.
3. Create an App Runner service for **API**:
   - Port `8000`
   - CPU 0.25 vCPU / 0.5 GB is enough
   - Auto scaling 1–8 (or 0 if you enable scale-to-zero where available)
   - Env / Secrets Manager: same keys as compose
4. Create MongoDB Atlas on AWS `ap-south-1`; allow App Runner egress IPs.

### 3.2 Web

**Easier:** second App Runner service, port `80`, image `kk-web` built with `REACT_APP_BACKEND_URL=https://api.YOUR_DOMAIN`.

**Cheaper CDN:** `yarn build` (or the web image’s `/usr/share/nginx/html` files) → S3 bucket (private) → CloudFront OAC. SPA needs custom error: 403/404 → `/index.html` so `/admin` works.

### 3.3 API Gateway (optional)

If you want a named public API, quotas, and WAF:

1. HTTP API (`aws_apigatewayv2_api`).
2. Route `POST /api/enquiry` and `GET /api/enquiries` to App Runner (or a VPC Link).
3. Do not proxy `/api/status`.
4. Attach AWS WAF (rate limit on POST).
5. Custom domain on the HTTP API → ACM cert → Route 53 `api.YOUR_DOMAIN`.

You can skip API Gateway and put App Runner behind CloudFront or a custom domain directly.

Sample ECS+ALB Terraform (same idea, more control): `infra/terraform/aws`.

### 3.4 Connect a domain on AWS

1. Request an **ACM certificate in us-east-1** for CloudFront (`YOUR_DOMAIN`, `www.YOUR_DOMAIN`). For App Runner / ALB / API Gateway in Mumbai, request a **second cert in ap-south-1** for `api.YOUR_DOMAIN`.
2. Validate the certs: ACM gives CNAME records — create them in Route 53 or at GoDaddy.
3. **If DNS stays at GoDaddy:** create the CNAMEs ACM asks for; then:

   | Type | Name | Value |
   | --- | --- | --- |
   | CNAME | `www` | `xxxx.cloudfront.net` or App Runner default URL |
   | CNAME | `api` | App Runner / API Gateway target |
   | ALIAS/CNAME | `@` | CloudFront or forwarding `https://www` |

   CloudFront needs an **Alias** (Route 53) or a CNAME if you use `www` only. Apex `@` on GoDaddy often uses a **forward** to `www`.

4. **If DNS moves to Route 53:** create a hosted zone, replace GoDaddy nameservers with the four NS records, then Alias A/AAAA to CloudFront / App Runner custom domain.

5. CloudFront alternate domain names (CNAMEs) + the us-east-1 ACM cert.
6. App Runner: **Custom domains** → add `api.YOUR_DOMAIN` → add the certificate validation / CNAME App Runner shows.
7. Rebuild the web image when the API hostname is final.

TLS is ready when the browser shows a padlock and no certificate warning.

---

## 4. Domain checklist (any cloud)

1. Decide hostnames: `www.YOUR_DOMAIN` (site + `/admin`) and `api.YOUR_DOMAIN`, **or** one host with `/api` at the load balancer.
2. Point DNS **only after** the cert or Cloud Run mapping exists (or use the records the cloud printed).
3. Rebuild the frontend whenever `REACT_APP_BACKEND_URL` changes (CRA inlines it).
4. Set `CORS_ORIGINS` to the exact site origin (`https://www.YOUR_DOMAIN`), not `*`, in production.
5. Force HTTPS (CloudFront viewer policy, Cloud Run, or LB redirect).
6. Add `www` → apex or apex → `www` so only one canonical URL.
7. Optional: email DNS (`MX`) stays at Google / your mail host — do not overwrite MX when adding CNAMEs.

---

## 5. Production env (minimum)

| Variable | Service |
| --- | --- |
| `MONGO_URL`, `DB_NAME` | API |
| `ADMIN_DASH_KEY` | API — long random string, not the local passcode |
| `CORS_ORIGINS` | API — `https://www.YOUR_DOMAIN` |
| `REACT_APP_BACKEND_URL` | Web **build** |
| `REACT_APP_BEHOLD_FEED_ID` | Web **build** (optional) |
| `EMERGENT_EMAIL_KEY`, `EMAIL_FROM_NAME`, `OWNER_EMAIL` | API import (still required by `server.py`) |

Never commit secrets. Rotate `ADMIN_DASH_KEY` if it appeared in chat or git.

---

## 6. Go-live test

1. `https://www.YOUR_DOMAIN` loads, `/admin` is the passcode screen.
2. Submit the contact form — Mongo has a new enquiry; mailto may still open.
3. Admin passcode lists that enquiry.
4. `curl -I https://api.YOUR_DOMAIN/api/` is 200 over TLS.
5. `curl https://api.YOUR_DOMAIN/api/enquiries` without the header is 401.
6. Mongo is not reachable from the public internet.
