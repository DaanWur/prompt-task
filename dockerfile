FROM node:20 as build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Use a smaller Node.js 20 image for the final stage
FROM node:20-slim

# Update package list and install necessary packages
RUN apt-get update && apt-get install -y --no-install-recommends libssl-dev dumb-init && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the built application from the build stage
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/package*.json ./
COPY --chown=node:node --from=build /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma

# Install production dependencies
RUN npm ci --omit=dev

# Copy Prisma client from the build stage
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

# Set environment variable to production
ENV NODE_ENV production

# Expose the application port
EXPOSE 8080

# Command to run the app
CMD ["npm", "run", "start:migrate:prod"]
