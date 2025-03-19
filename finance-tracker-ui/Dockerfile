# Use the official Node.js image as a base
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the Next.js application
RUN npm run build

# Use a lightweight Node.js runtime
FROM node:18-alpine AS runner

WORKDIR /src/app

# Copy built assets from the builder stage
COPY --from=builder /src/app ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]
