# Kubernetes Example Configs (k8s-demo)

These are **abstracted, public-safe** example configurations. They contain no real secrets, domains, IPs, or image references.

Use these as templates for your own deployment. Replace all placeholder values (`example.com`, `yourusername`, `your-image`, etc.) with your actual configuration.

## Ingress: Gateway API + Contour

This project uses **Gateway API** with **Contour** as the data plane (Envoy proxy) for all ingress routing. There are no NGINX ingress references — Gateway API is the production standard here.

```
Internet → Cloudflare (WAF/DNS) → Envoy (Contour) → Service → Pods
                                       ↑
                                  Gateway API
                              (GatewayClass, Gateway, HTTPRoute)
```

## Structure

```
k8s-demo/
├── deployment.yaml              # App deployment with security contexts
├── service.yaml                 # ClusterIP service
├── cluster-issuer.yaml          # cert-manager ClusterIssuer (Let's Encrypt)
├── cert-manager.yaml            # cert-manager CRDs
├── network-policy.yaml          # Pod network isolation
├── pod-security-policy.yaml     # Namespace security standards
├── gateway-api/                 # Gateway API resources (Contour)
│   ├── gatewayclass.yaml        # GatewayClass definition
│   ├── gateway.yaml             # Gateway with HTTP + HTTPS listeners
│   └── httproute.yaml           # HTTPRoute for traffic routing
└── argocd/                      # ArgoCD GitOps setup
    ├── SETUP.md                 # Setup instructions
    ├── install.yaml             # ArgoCD CRDs and controllers
    └── application.yaml         # ArgoCD Application definition
```

## Quick Start

```bash
# 1. Install cert-manager
kubectl apply -f cert-manager.yaml

# 2. Create ClusterIssuer (edit email first)
kubectl apply -f cluster-issuer.yaml

# 3. Deploy application
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# 4. Set up Gateway API routing (Contour)
kubectl apply -f gateway-api/gatewayclass.yaml
kubectl apply -f gateway-api/gateway.yaml
kubectl apply -f gateway-api/httproute.yaml

# 5. Apply security policies
kubectl apply -f network-policy.yaml
kubectl apply -f pod-security-policy.yaml
```

## Notes

- Real production configs belong in a **private** `k8s/` directory (gitignored)
- Never commit secrets, real IPs, or domain names to a public repository
- Use `kubectl create secret` for sensitive values
- Contour installation: `kubectl apply -f https://projectcontour.io/quickstart/contour.yaml`
- Gateway API CRDs: `kubectl apply --server-side -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.4.0/standard-install.yaml`
