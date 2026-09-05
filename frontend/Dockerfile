# ============================================================
# MediCore HMS Frontend — Dockerfile for Cloud / Railway
# ============================================================

# Stage 1: Build React Application
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build argument for backend API URL (can be set in Railway variables)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2: Minimal runtime image with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx html
RUN rm -rf ./*

# Copy built assets
COPY --from=builder /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose default port
EXPOSE 80

# Dynamically bind to Railway $PORT if provided, then run Nginx
CMD ["/bin/sh", "-c", "sed -i 's/listen 80;/listen '${PORT:-80}';/g' /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
