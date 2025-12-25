FROM node:22.12.0-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --mode production

FROM nginx:alpine

# KEEP default.conf (DO NOT DELETE IT)
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
