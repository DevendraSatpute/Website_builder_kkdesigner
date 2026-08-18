FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY frontend/ ./

# Empty backend URL => browser calls same-origin /api (nginx proxies it).
ARG REACT_APP_BACKEND_URL=
ARG REACT_APP_BEHOLD_FEED_ID=
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL \
    REACT_APP_BEHOLD_FEED_ID=$REACT_APP_BEHOLD_FEED_ID \
    CI=true \
    GENERATE_SOURCEMAP=false

RUN yarn build

FROM nginx:1.27-alpine

COPY infra/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
