# Use Node.js as the base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for efficient layer caching
COPY package.json package-lock.json ./

RUN npm install @reduxjs/toolkit react-redux next react react-dom

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
