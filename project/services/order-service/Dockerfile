# Optimized Node.js Alpine base
FROM node:20-alpine

# Internal working directory
WORKDIR /app

# Cache dependency layers
COPY package*.json ./
RUN npm install

# Source files
COPY . .

# Ensure Prisma Client is generated during build
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Default port for Order Service
EXPOSE 3002

# Startup command
CMD ["node", "src/index.js"]
