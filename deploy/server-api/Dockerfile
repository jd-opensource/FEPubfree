FROM node:12.22.12-alpine3.15
WORKDIR /root
COPY . .
RUN yarn global add pnpm@6 && \
    pnpm config set registry https://registry.npm.taobao.org && \
    pnpm config set recursive-install false && \
    cd packages/server-api && \
    pnpm install && \
    pnpm run build
CMD cd packages/server-api && pnpm run start
