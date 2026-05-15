# Node.js Alpine base
FROM node:20-alpine

WORKDIR /app

# Install production-only server dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy static assets and server logic
COPY . .

# Default port for Serving the frontend
EXPOSE 8000

# Start Express to serve the dashboard
CMD ["node", "src/index.js"]
