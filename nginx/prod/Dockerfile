FROM nginx:alpine
LABEL service="nginx-prod"

RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/sites

COPY nginx.conf /etc/nginx/nginx.conf
COPY sites/ /etc/nginx/sites/

CMD ["nginx", "-g", "daemon off;"]