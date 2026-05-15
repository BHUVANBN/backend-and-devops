# Standard Node.js base
FROM node:20-alpine

WORKDIR /app

# Copy deps
COPY package*.json ./

# Install deps
RUN npm ci

# Copy source code
COPY . .

# Expose service port 3004 (Payment) / 3005 (Media)
# We can dynamically set this or just keep it as specified in index.js
EXPOSE 3004

# Build and start the app
CMD ["node", "src/index.js"]
