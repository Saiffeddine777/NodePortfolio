LABEL service="nginx-dev"

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf

COPY sites/ /etc/nginx/sites/

RUN nginx -t

CMD ["nginx", "-g", "daemon off;"]