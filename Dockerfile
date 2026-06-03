# syntax=docker/dockerfile:1

# Serve the static site with Nginx.
FROM nginx:1.27-alpine

# Copy site files into the default Nginx web root.
COPY . /usr/share/nginx/html

EXPOSE 80
