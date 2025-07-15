# Этап сборки
FROM node:18-alpine AS builder

# Установим рабочую директорию
WORKDIR /app

# Скопируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Установим зависимости
RUN npm install

# Скопируем весь код фронтенда
COPY . .

# Передадим RHINO_API_KEY как аргумент сборки
ARG RHINO_API_KEY
ENV VITE_RHINO_API_KEY=$RHINO_API_KEY

# Соберём приложение
RUN npm run build

# Этап продакшена
FROM nginx:alpine

# Скопируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Скопируем собранные файлы из этапа сборки
COPY --from=builder /app/dist /usr/share/nginx/html

# Скопируем SSL-сертификаты (если они не монтируются через volumes)
# Если сертификаты монтируются через docker-compose, эти строки можно закомментировать
# COPY cert.pem /etc/ssl/cert.pem
# COPY key.pem /etc/ssl/key.pem

# Открываем порты
EXPOSE 80 443

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
