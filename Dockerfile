FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies securely
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the API port (handled by env in compose, but 3000 is default)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
