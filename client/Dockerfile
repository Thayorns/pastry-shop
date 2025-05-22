# build stage
FROM node:18.20.8-alpine AS builder
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pkgconfig \
    pixman \
    cairo \
    pango \
    giflib-dev \
    libjpeg-turbo-dev \
    librsvg-dev \
    libpng-dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# run stage
FROM nginx:alpine
WORKDIR /app
RUN apk add --no-cache certbot
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY certbot.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/certbot.sh
EXPOSE 80 443
CMD ["sh", "-c", "/usr/local/bin/certbot.sh && nginx -g 'daemon off;'"]