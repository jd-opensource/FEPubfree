# Pubfree 前端发布平台

## 描述
### 简介
现代化SAAS前端发布2.0。支持severless，无需关注运维和成本。支持灰度回滚、版本管理、多环境、成员管理、个性化域名、空间聚合等功能，可使用 zip 上传或录入资源地址等发布方式。
### 主要技术栈
- 前端 React + Antd
- 后端 NodeJS + MySQL
- 工具 pnpm、vite
## 目录
[TOC]
## 安装
安装前请确保已安装 MySQL 和 NodeJS 且 NodeJS 版本高于 v16.0.0。
### 安装 pnpm
````bash
npm install -g pnpm
````
查看 pnpm 版本，确认 pnpm 已经安装成功
````bash
pnpm -v
````
### 安装依赖
项目根目录下安装项目依赖
````bash
pnpm install
````
### 数据库建表
将 open-source/packages/server-api/script/sql/init.sql 文件中的sql 语句复制到 MySQL 中运行，建立服务所需的基本数据库表。
### 运行 server-api
在 open-source/packages/server-api/resource 下新建 config.default.json，并配置数据库等信息
````js
{
  "orm": {
    "host": "127.0.0.1",
    "port": 3306,
    "database": "pubfree_open",
    "username": "root",
    "password": "root"
  }
}

````
本地运行
````bash
cd packages/server-api
pnpm dev
````
在本地 http://127.0.0.1:7001 下便可访问到 cms 页面用到的接口。
### 运行 server-client
在 open-source/packages/server-client/resource 下新建 config.default.json，并配置数据库等信息
````js
{
  "mysql": {
    "enable": true,
    "options": {
      "host": "127.0.0.1",
      "port": 3306,
      "database": "pubfree_open",
      "username": "root",
      "password": "root"
    }
  },
  "schedule": {
    "enable": true
  }
}
````
本地运行
````bash
cd packages/server-client
pnpm dev
````
通过 http://127.0.0.1:3000 可访问到发布在平台上的页面。
### 运行 client-web
本地运行
````bash
cd packages/client-web
pnpm dev
````
通过 http://localhost:5173 可访问发布平台的 cms 页面。
## 使用
### 快速发布流程
#### 1. 创建项目
![image](https://img14.360buyimg.com/imagetools/jfs/t1/105149/20/34273/57679/635a36bbE218c80ef/f0e2aae07970886b.png)
#### 2. 资源发布
使用 zip 上传或者输入 html 资源地址发布
![image](https://img11.360buyimg.com/imagetools/jfs/t1/163595/19/28519/58928/635a3728E590137d6/47cafdfe3dc8f304.png)
![image](https://img11.360buyimg.com/imagetools/jfs/t1/165869/35/31958/58647/635a37adE079e68bb/ec97699dfc18b23c.png)
#### 3. 资源生效
![image](https://img10.360buyimg.com/imagetools/jfs/t1/212448/21/22800/62291/635a3d73Ef52f159c/b9da61eb8847544e.png)
#### 4. 查看页面
![image](https://img14.360buyimg.com/imagetools/jfs/t1/109768/38/33231/62656/635a3dd6E287d9b3c/482c3616706297ed.png)

## License
[MIT © JD.com, Inc.](./LISENCE)