# 🚀 Инструкция по публикации ИгроТренд в открытый доступ

## Подготовка проекта

Проект готов к деплою:
- ✅ Next.js 16 с App Router
- ✅ Prisma + SQLite база данных (для разработки)
- ✅ Все API endpoints работают
- ✅ Мультиязычность (RU, KZ, EN, BY)
- ✅ Авторизация и регистрация
- ✅ Dev Panel для администрирования

---

## ⚠️ ВАЖНО: Перед первым деплоем

1. **Смените JWT_SECRET** на сложный случайный ключ:
   ```bash
   # Генерация надёжного секрета
   openssl rand -base64 64
   ```

2. **Никогда не коммитьте .env файл!**

3. **Создайте .env.production** на сервере/хостинге с реальными значениями

---

## Вариант 1: Vercel (Рекомендуется для Next.js)

### Шаг 1: Подготовка репозитория

```bash
# Инициализация Git
git init

# Коммит
git add .
git commit -m "Initial commit - IgroTrend platform"

# Создать репозиторий на GitHub и загрузить
git remote add origin https://github.com/YOUR_USERNAME/igrotrend.git
git push -u origin main
```

### Шаг 2: Деплой на Vercel

> **В продакшене** используйте `npx prisma migrate deploy` вместо `bun run db:push`.


1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите **"Sign Up"** → выберите **"Continue with GitHub"**
3. После входа нажмите **"Add New..."** → **"Project"**
4. Выберите ваш репозиторий `igrotrend`
5. Настройки проекта:
   - **Framework Preset:** Next.js (автоопределение)
   - **Root Directory:** `./`
   - **Build Command:** `bun run build`
   - **Output Directory:** `.next`
   
6. **Environment Variables** (обязательно!):
   ```
   DATABASE_URL="ваш-connection-string-от-базы"
   JWT_SECRET="ваш-сгенерированный-секрет-64-символа"
   NEXT_PUBLIC_APP_URL="https://your-app-name.vercel.app"
   ```

7. Нажмите **"Deploy"**
8. Ждите 2-3 минуты → сайт готов!

### Шаг 3: Настройка базы данных на Vercel

⚠️ **Важно:** SQLite не работает на Vercel (read-only filesystem). 

**Рекомендуемые варианты:**

#### A. PlanetScale (MySQL)
1. Создайте аккаунт на [planetscale.com](https://planetscale.com)
2. Создайте базу данных
3. Получите connection string
4. Добавьте в Vercel Environment Variables

#### B. Supabase (PostgreSQL)
1. Создайте проект на [supabase.com](https://supabase.com)
2. Скопируйте Connection String
3. Обновите `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

#### C. Vercel Postgres
1. В проекте Vercel: **Storage** → **Create Database** → **Postgres**
2. Подключится автоматически

### Шаг 4: Миграция базы данных

```bash
# Установите Vercel CLI
npm i -g vercel

# Подключите проект
vercel link

# Загрузите переменные окружения
vercel env pull .env.production

# Выполните миграции
npx prisma migrate deploy

# Создайте developer аккаунт
DATABASE_URL="..." bun run seed
```

---

## Вариант 2: VPS / Выделенный сервер

### Шаг 1: Требования к серверу

- Ubuntu 20.04+ или аналогичный Linux
- Минимум 1GB RAM, 10GB SSD
- Node.js 18+ или Bun

### Шаг 2: Установка на сервере

```bash
# Подключение по SSH
ssh user@your-server-ip

# Установка Bun
curl -fsSL https://bun.sh/install | bash

# Клонирование проекта
git clone https://github.com/YOUR_USERNAME/igrotrend.git
cd igrotrend

# Установка зависимостей
bun install

# Создание .env (ВАЖНО!)
cp .env.example .env
nano .env  # отредактируйте переменные!

# Сборка
bun run build

# Миграция БД
bun run db:push
bun run seed
```

### Шаг 3: PM2 для автозапуска

```bash
# Установка PM2
npm install -g pm2

# Создание конфигурации
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'igrotrend',
    script: 'bun',
    args: 'run start',
    cwd: '/path/to/igrotrend',
    instances: 1,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Запуск
pm2 start ecosystem.config.js

# Автозапуск при перезагрузке
pm2 startup
pm2 save
```

### Шаг 4: Nginx как обратный прокси

```bash
# Установка Nginx
sudo apt install nginx

# Конфигурация
sudo nano /etc/nginx/sites-available/igrotrend
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Активация
sudo ln -s /etc/nginx/sites-available/igrotrend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Шаг 5: SSL сертификат (Let's Encrypt)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d yourdomain.com

# Автообновление
sudo certbot renew --dry-run
```

---

## Вариант 3: Docker

### Dockerfile (в корне проекта)

```dockerfile
FROM oven/bun:1 as base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lockb ./
COPY prisma ./prisma/
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build
RUN bun run db:push

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/db ./db

EXPOSE 3000
CMD ["bun", "run", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./db/custom.db
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./db:/app/db
    restart: unless-stopped
```

### Запуск

```bash
docker-compose up -d
```

---

## Вариант 4: Railway.app (Простой деплой)

1. Перейдите на [railway.app](https://railway.app)
2. **"Start a New Project"** → **"Deploy from GitHub repo"**
3. Выберите репозиторий
4. Railway автоматически определит Next.js
5. Добавьте переменные окружения (DATABASE_URL, JWT_SECRET)
6. **Deploy** → получите URL

---

## Проверка после деплоя

### 1. Создание developer аккаунта

```bash
# На сервере или через Vercel CLI
bun run seed
```

### 2. Функционал для проверки

- [ ] Главная страница загружается
- [ ] Регистрация работает
- [ ] Вход работает
- [ ] Dev Panel доступен
- [ ] Смена языка работает
- [ ] Создание постов
- [ ] Создание клубов
- [ ] Создание команд

---

## Доменное имя

### Покупка домена
- [Namecheap](https://namecheap.com)
- [GoDaddy](https://godaddy.com)
- [Reg.ru](https://reg.ru) (для РФ)

### Подключение к Vercel
1. Vercel Dashboard → проект → **Settings** → **Domains**
2. Введите ваш домен
3. Добавьте DNS записи:
   - **A record:** `76.76.21.21`
   - или **CNAME:** `cname.vercel-dns.com`

### Подключение к VPS
1. **A record:** `IP вашего сервера`

---

## Переменные окружения (Production)

```env
# База данных
DATABASE_URL="postgresql://..."  # или mysql://

# JWT секрет (минимум 64 символа!)
JWT_SECRET="сгенерируйте-надёжный-секрет"

# URL приложения
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Email (опционально)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

---

## Безопасность ✅

- [x] JWT_SECRET минимум 64 символа
- [x] .env НЕ в git
- [x] HTTPS включён
- [ ] Rate limiting (добавить)
- [ ] 2FA (опционально)

---

## Мониторинг

### Vercel
- Dashboard → проект → **Logs**

### VPS
```bash
pm2 logs igrotrend
tail -f /var/log/nginx/access.log
```

---

## Обновления

```bash
git pull origin main
bun install
bun run build
pm2 restart igrotrend  # для VPS
# Vercel обновится автоматически
```

---

**Удачи с запуском! 🎮**
