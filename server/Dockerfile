# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app
ENV NODE_ENV=development
ENV LOGGING=true

# Copy package.json and package-lock.json
COPY package.json package-lock.json /usr/src/app/

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3010

# Start the NestJS application
CMD ["node", "dist/src/main"]
