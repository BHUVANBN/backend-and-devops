import 'dotenv/config';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';

const app = express();

// Logging Middleware
// In production, we'd use a more structured logger like Winston/Pino
// to send logs to a centralized system (ELK, Datadog).
app.use(morgan('dev'));

// Service Target URLs (from env or discovery in K8s)
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004';
const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL || 'http://localhost:3005';

/**
 * API Gateway routing and proxying logic.
 * 
 * Each route is proxied to the appropriate microservice.
 * This hides the complex inner architecture from the client.
 */

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'UP', service: 'api-gateway' }));

// Auth Service Proxy
app.use('/api/v1/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/auth': '/api/v1/auth' } 
}));

// Order Service Proxy
app.use('/api/v1/orders', createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/v1/orders': '/api/v1/orders' }
}));

// Payment Service Proxy
app.use('/api/v1/payments', createProxyMiddleware({
  target: PAYMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/payments': '/api/v1/payments' }
}));

// Media Service Proxy
app.use('/api/v1/media', createProxyMiddleware({
  target: MEDIA_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/media': '/api/v1/media' }
}));

// Error handling for dead services
// When a downstream service is down, the proxy will timeout or fail.
app.use((err, req, res, next) => {
  console.error('Proxy Error 💥', err);
  res.status(502).json({
    status: 'error',
    message: 'Bad Gateway - Service is temporarily unavailable.'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log(`👉 Auth: ${AUTH_SERVICE_URL}`);
    console.log(`👉 Payment: ${PAYMENT_SERVICE_URL}`);
    console.log(`👉 Media: ${MEDIA_SERVICE_URL}`);
});
