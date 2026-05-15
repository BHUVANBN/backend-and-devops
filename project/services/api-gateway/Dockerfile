# Use an official Node.js runtime as the base image
# Alpine is used for its small footprint, which reduces image size and security surface area.
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and lock file first to leverage Docker's layer caching
# This speeds up subsequent builds by skipping dependency installs if files haven't changed.
COPY package*.json ./

# Install only production dependencies
# 'npm ci' is faster and more reliable than 'npm install' for CI/CD.
RUN npm install --only=production

# Copy the rest of the service source code
COPY . .

# Expose the port the service listens on
EXPOSE 3000

# Command to start the service
# 'node' is used directly instead of 'npm start' to handle OS signals (like SIGTERM) properly.
CMD ["node", "index.js"]
