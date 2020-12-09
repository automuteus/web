FROM node:15.3-alpine3.10 AS builder
WORKDIR /app 
COPY client/package.json /app 
COPY client/yarn.lock /app
COPY client/ /app 
RUN yarn install && yarn build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/build .
RUN rm /etc/nginx/conf.d/default.conf  # <= This line solved my issue
COPY nginx.conf /etc/nginx/conf.d
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]