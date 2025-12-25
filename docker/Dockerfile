FROM node:20

COPY ./_files/app /app
COPY ./_files/adminbot /adminbot
COPY ./_files/flag /flag
COPY ./_files/start.sh /start.sh

RUN chmod +x /start.sh \
    && chmod 777 /app/public/views/htmls \
    && chmod 644 /flag

# 使用 bookworm 官方源（默认就有，这里可不写）
# 安装系统依赖（已修好 bookworm）
RUN apt-get update \
    && apt-get install -y \
       libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
       libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
       libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 \
    && rm -rf /var/lib/apt/lists/*

# app
WORKDIR /app
RUN npm config set loglevel=http \
    && npm config set registry https://registry.npmmirror.com \
    && npm install

# adminbot
WORKDIR /adminbot
RUN npm config set loglevel=http \
    && npm config set registry https://registry.npmmirror.com \
    && npm install

CMD ["/start.sh"]