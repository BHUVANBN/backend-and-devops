# Use official Node.js Alpine base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Ensure Prisma Client is generated during build
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
# This Step ensures that the Prisma client is available and up-to-date.
# It uses the schema located in the ./prisma/ folder.

# Expose service port 3001
EXPOSE 3001

# Run the application
# Use the compiled or direct source entry point
CMD ["node", "src/index.js"]
