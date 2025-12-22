FROM nginx:alpine

LABEL service="nginx-dev"

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf

COPY sites/ /etc/nginx/sites/

RUN nginx -t

CMD ["nginx", "-g", "daemon off;"]