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

# run stage
FROM node:18.20.8-alpine
WORKDIR /app
COPY --from=builder /app .
RUN npm install pm2 -g
EXPOSE 3001
CMD [ "pm2-runtime", "index.js" ]
