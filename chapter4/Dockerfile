# Use Node.js 22 as the base image
FROM node:22

# Set the working directory in docker container
WORKDIR /app

# Copy package.json and package-lock.json to docker container
COPY package*.json ./
COPY .env ./

# Install dependencies in docker container
RUN npm install

# Copy the rest of the application code to docker container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# define command to run the application
CMD ["sh", "-c", "npx prisma generate && node ./src/server.js"]