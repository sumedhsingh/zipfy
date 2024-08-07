# Stage1: Build React app
FROM node:16-alpine as frontend-build 

# Set working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY frontend/frontend/ ./

# Build React app
RUN npm run build

# Stage 2: Serve React App
FROM nginx:alpine

# Copy the built React app to the Nginx html directory
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]