# Use a smaller Node.js 20 image for the final stage
FROM node:20-slim as base

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

# Run post-install script
RUN npm run postinstall

# Copy Prisma client from the build stage
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

# Set environment variable to production
ENV NODE_ENV production

# Expose the application port
EXPOSE 8080

# Command to run the app
CMD ["npm", "run", "start:migrate:prod"]

# New stage for Node.js 22 with additional dependencies
FROM node:22

SHELL ["/bin/bash", "-c"]
RUN apt-get update && \
    apt-get install -y --no-install-recommends mesa-vulkan-drivers libegl1 git cmake clang libgomp1 && \
    rm -rf /var/lib/apt/lists/*

ENV NVIDIA_VISIBLE_DEVICES=all
ENV NVIDIA_DRIVER_CAPABILITIES=all

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . /opt/app

# Install dependencies
RUN npm ci

# Download the model
RUN npm run models:pull

CMD ["npm","run", "start:migrate:prod"]