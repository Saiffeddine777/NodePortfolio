FROM nginx:alpine
LABEL service="nginx-dev"

RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/sites

COPY nginx.conf /etc/nginx/nginx.conf
COPY sites/ /etc/nginx/sites/

# REMOVE OR COMMENT OUT THIS LINE:
# RUN nginx -t 

CMD ["nginx", "-g", "daemon off;"]