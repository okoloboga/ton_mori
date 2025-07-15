# Этап сборки
FROM node:18-alpine AS builder

RUN apk add --no-cache python3 py3-pip make g++ linux-headers libudev-zero-dev

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Копируем ВСЕ файлы включая .env
COPY . .

# Проверяем что .env скопировался
RUN ls -la && cat .env || echo "No .env file"

RUN npm run build

# Этап продакшена
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
