# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source files and build
COPY . .
RUN npm run build -- --configuration=production

# Runtime stage
FROM nginx:alpine AS runtime

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from build stage
COPY --from=build /app/dist/digital-farmer/browser /usr/share/nginx/html

# Railway uses PORT environment variable
# nginx.conf is configured to use $PORT
EXPOSE 80

# Start nginx with PORT substitution
CMD sh -c "envsubst '\$PORT' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf.tmp && mv /etc/nginx/nginx.conf.tmp /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
