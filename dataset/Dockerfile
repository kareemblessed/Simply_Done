# Use Node.js as base image
FROM node:18-alpine

# Set up the working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the app with Vite
RUN npm run build

# Create a non-root user for security
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Make the test runner script executable
RUN chmod +x run_tests.sh

# Set the entrypoint to your test runner
ENTRYPOINT ["./run_tests.sh"]