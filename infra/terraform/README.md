# Cross-cloud Terraform strategy

Do **not** write one resource that works on both AWS and GCP. Cloud APIs do not share types. Share **contract**, not `aws_lb` vs `google_cloud_run`.

## Shared contract (same inputs, two stacks)

| Input | Meaning |
| --- | --- |
| `image_api` / `image_web` | Same Docker images you built locally |
| `admin_dash_key` | `X-Admin-Key` for `GET /api/enquiries` |
| `min/max` or `desired_count` | Scale knobs |
| `modules/labels` | Same name + tags on both clouds |

```
infra/terraform/
  modules/labels/     # shared
  aws/                # ECS Fargate + ALB path routing
  gcp/                # Cloud Run (serverless containers)
```

## How to apply one stack

```bash
# after images are in ECR / Artifact Registry
cd infra/terraform/gcp
terraform init
terraform plan \
  -var='project_id=YOUR_GCP_PROJECT' \
  -var='image_api=asia-south1-docker.pkg.dev/PROJECT/kk/api:latest' \
  -var='image_web=asia-south1-docker.pkg.dev/PROJECT/kk/web:latest' \
  -var='admin_dash_key=CHANGE_ME'
```

AWS is the same idea with `vpc_id` and `subnet_ids`.

## API Gateway (if you want a named public API)

Only these routes should be internet-facing:

| Method | Path | Auth | Why public |
| --- | --- | --- | --- |
| POST | `/api/enquiry` | none | Contact form backup |
| GET | `/api/enquiries` | header `X-Admin-Key` | Admin dashboard |
| GET | `/api/` | none | Health (optional) |

Keep Mongo, secrets, and `/api/status` off the public surface (or delete `/status`).

**AWS:** HTTP API (`aws_apigatewayv2_api`) → VPC Link → ECS, or ALB path rule `/api/*` (sample in `aws/main.tf`).

**GCP:** API Gateway / Cloud Endpoints in front of Cloud Run, or skip it and put Cloud Run behind a global HTTPS load balancer. Cloud Run itself is already an HTTPS public endpoint.

## Serverless vs containers vs Kubernetes

| Fit | Use |
| --- | --- |
| Lowest ops, bursty traffic | GCP Cloud Run or AWS App Runner / Lambda+Mangum |
| Same image, more control | ECS Fargate / Cloud Run |
| Multi-service, HPA, mesh | GKE / EKS (`infra/k8s`) |

This app is small. Prefer **Cloud Run or Fargate**. Use Kubernetes when you already run a cluster or need many replicas + HPA + ingress policies.
