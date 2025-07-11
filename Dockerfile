# --- 빌드 스테이지 ---
FROM node:22.16-alpine AS build

WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install
COPY . /app

#  build ARG 수신 및 주입
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

#  .env 대신 환경변수 직접 주입
RUN echo "VITE_API_URL=$VITE_API_URL" > .env && npm run build

# --- 배포 스테이지 ---
FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
