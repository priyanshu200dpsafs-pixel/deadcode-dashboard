#!/bin/bash

echo "🚀 Starting Deployment for DeadCode..."

# Bring down any old containers
echo "Stopping old containers..."
docker-compose down

# Build the new Docker image for the Node API and spin up the infrastructure
echo "Building and spinning up infrastructure (3x API replicas, Nginx, MongoDB)..."
docker-compose up -d --build

echo "✅ Deployment Successful!"
echo "The DeadCode dashboard is now live and load-balanced at http://localhost"
