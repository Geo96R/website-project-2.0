# ArgoCD GitOps Setup (Demonstration)

## Why This Is A Demo

This ArgoCD setup demonstrates GitOps principles. In a real production environment, ArgoCD would watch a **private** repository containing your actual Kubernetes manifests.

**How it works in production:**
- Private repo holds real `k8s/` manifests (domains, images, secrets refs)
- ArgoCD watches the private repo and auto-deploys on merge to `main`
- No `kubectl rollout restart` needed — ArgoCD handles it
- Git becomes the single source of truth for cluster state

---

## 1. Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f k8s/argocd/install.yaml
```

Wait for pods:
```bash
kubectl get pods -n argocd -w
```

## 2. Get ArgoCD Admin Password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo
```

Login to ArgoCD UI with username `admin` and this password.

## 3. Expose ArgoCD via Gateway API

Create an HTTPRoute for ArgoCD (adapt the gateway-api examples in this repo):

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: argocd-route
  namespace: argocd
spec:
  hostnames:
  - argocd.example.com
  parentRefs:
  - name: contour-gateway
    namespace: default
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: argocd-server
      port: 443
```

## 4. Deploy Your App via GitOps

```bash
kubectl apply -f k8s/argocd/application.yaml
```

ArgoCD now watches your `k8s/` folder and auto-deploys changes when you push to main.
