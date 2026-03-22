# DevOps Portfolio

A server-rendered portfolio site built with Express and EJS, deployed on Kubernetes with full infrastructure-as-code. The site covers architecture decisions, security practices, Kubernetes patterns, case studies, and research - everything backed by the same tooling described in the content.

## Tech Stack

| Layer | Tools |
|-------|-------|
| **Application** | Express 5, EJS templates, vanilla JS/CSS |
| **Container** | Docker multi-stage build (Node 20 Alpine) |
| **Orchestration** | K3s, Gateway API (Contour + Envoy) |
| **CI/CD** | GitHub Actions → GHCR → kubectl rollout |
| **Infrastructure** | Terraform (Cloudflare DNS, WAF, zone settings) |
| **TLS** | cert-manager, Let's Encrypt, DNS-01 via Cloudflare |
| **GitOps (demo)** | ArgoCD application manifests in `k8s-demo/` |
| **Security scanning** | Trivy image scan in CI pipeline |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with blog feed |
| `/architecture` | Animated request-flow and deployment-pipeline diagrams |
| `/security` | Security posture: supply-chain, network policies, pod security |
| `/kubernetes` | Kubernetes patterns and cluster design |
| `/skills` | Technical skills with expandable detail cards |
| `/cases` | Engineering case studies (real debugging war stories) |
| `/blog` | Long-form posts on platform engineering and CI/CD |
| `/research` | Industry signals: Gateway API adoption, supply-chain security, platform engineering trends |
| `/contact` | Contact form with rate limiting and honeypot spam protection |

## Quick Start

```bash
git clone https://github.com/Geo96R/website-project-2.0.git
cd website-project-2.0
npm install
node server.js
```

Open `http://localhost:3000`.

### Docker

```bash
docker build -f docker/Dockerfile -t website-project .
docker run -p 3000:3000 website-project
```

## Project Structure

```
├── server.js                  # Express app entry point
├── views/
│   ├── layout.ejs             # Base layout (nav, footer, head)
│   └── pages/                 # Page templates (architecture, skills, blog, etc.)
├── public/
│   ├── css/                   # Stylesheets
│   └── js/                    # Client-side scripts
├── data/
│   └── blog.json              # Blog post metadata
├── docker/
│   └── Dockerfile             # Multi-stage production build
├── k8s-demo/                  # Sanitized Kubernetes examples (safe to share)
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── gateway-api/           # GatewayClass, Gateway, HTTPRoute
│   ├── cluster-issuer.yaml    # cert-manager + Cloudflare DNS-01
│   ├── network-policy.yaml    # Pod-level network segmentation
│   ├── pod-security-policy.yaml
│   └── argocd/                # ArgoCD application + setup guide
├── infra/
│   └── cloudflare/            # Terraform: DNS, WAF, security headers, bot config
└── .github/workflows/
    ├── deploy.yml             # Build → push to GHCR → deploy to K3s
    ├── terraform.yml          # Terraform plan/apply on infra changes
    └── auto-version.yml       # Semantic version tagging
```

Production `k8s/` configs are gitignored - `k8s-demo/` contains equivalent sanitized examples with placeholder values so you can replicate the setup.

## Deployment

Pushes to `main` trigger the full pipeline automatically:

1. **Build** - Docker image built and pushed to GitHub Container Registry
2. **Scan** - Trivy scans the image for critical/high vulnerabilities
3. **Deploy** - `kubectl rollout restart` against the K3s cluster

Infrastructure changes under `infra/cloudflare/` trigger a separate Terraform workflow.

### Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `KUBECONFIG` | Base64-encoded kubeconfig for the K3s cluster |
| `CF_API_TOKEN` | Cloudflare API token (DNS, zone settings, WAF, bot management) |
| `CF_ZONE_ID` | Cloudflare zone identifier |
| `SERVER_IP` | Server IP for DNS A record |
| `ALLOWED_IP` | Restricted access IP for Cloudflare WAF rules |

`GITHUB_TOKEN` is provided automatically by GitHub Actions for GHCR authentication.

## Why Gateway API over Ingress

[Ingress NGINX is retired as of March 2026](https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement/) - no more releases, bugfixes, or security patches. Gateway API is the official successor with better role separation (infra vs app teams), richer routing, and active development. This project uses Contour as the Gateway controller with Envoy as the data plane.

The `k8s-demo/gateway-api/` directory has ready-to-use examples.

## License

[MIT](LICENSE)
