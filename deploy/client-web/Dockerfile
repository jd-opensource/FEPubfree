FROM nginx:1.23.2-alpine
COPY packages/client-web/dist/ /usr/share/nginx/html
COPY deploy/client-web/nginx.conf /etc/nginx/conf.d/default.conf
