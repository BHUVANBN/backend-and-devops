# AWS EKS Deployment Guide (Production Microservices)

## Overview
This document outlines the steps to deploy our containerized microservices fleet to **AWS Elastic Kubernetes Service (EKS)**.

## 1. Prerequisites
- **AWS CLI**: Configured with an IAM user having `AdministratorAccess`.
- **eksctl**: The official CLI for Amazon EKS.
- **kubectl**: For interacting with the cluster.
- **Docker**: Set up on your local machine if not using CI/CD.

## 2. Infrastructure Provisioning (using `eksctl`)
Provisioning an EKS cluster with managed node groups across multiple Availability Zones (AZs) ensures high availability.

```bash
# In the terminal:
# Create a cluster with 2 nodes (t3.medium recommended for production)
eksctl create cluster \
  --name micro-prod-cluster \
  --region us-east-1 \
  --with-oidc \
  --nodes 2 \
  --node-type t3.medium \
  --managed
```

## 3. Configure Database Access (RDS/Neon)
Ensure the **VPC Security Groups** of your EKS cluster allow outbound traffic (typically port 5432) to your external **Neon PostgreSQL** database.

## 4. Install AWS Load Balancer Controller
To handle our `Ingress` and `LoadBalancer` services, we need the AWS-specific controller.

```bash
# Add the EKS helm repo
helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=micro-prod-cluster
```

## 5. Deploy the Application
Once the cluster is ready, apply the manifests we created in the `infra/kubernetes/` directory.

```bash
# 1. First, create ConfigMaps and Secrets
kubectl apply -f infra/kubernetes/configmap.yaml
kubectl apply -f infra/kubernetes/secrets.yaml

# 2. Deploy individual services
kubectl apply -f infra/kubernetes/auth-service.yaml
kubectl apply -f infra/kubernetes/media-service.yaml
kubectl apply -f infra/kubernetes/payment-service.yaml
kubectl apply -f infra/kubernetes/api-gateway.yaml

# 3. Apply the Ingress rule to create the ELB/ALB
kubectl apply -f infra/kubernetes/ingress.yaml
```

## 6. Verify Production Deployment
Check if the services are healthy and the public endpoint is reachable.

```bash
kubectl get deployments
kubectl get services -o wide
# Retrieve the public ALB address from the ingress resource
kubectl get ingress
```

## 7. Next Steps: Post-Deployment 
- **Domain Mapping**: Point your Route 53 domain name to the ALB address.
- **Monitoring**: Enable AWS CloudWatch for logs and metrics.
- **Auto-Scaling**: Configure the Horizontal Pod Autoscaler (HPA).
