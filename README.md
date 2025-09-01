# ims-web

#### 介绍

湖北信义玻璃 进销存 前端

#### 软件架构

软件架构说明

#### 安装教程

在启动项目前，你需要确保你的环境满足以下要求：

Node.js 20.15.0 及以上版本，推荐使用 fnm 、 nvm 或者直接使用 pnpm 进行版本管理。

验证你的环境是否满足以上要求，你可以通过以下命令查看版本：

# 出现相应 node LTS 版本即可

node -v

# 下载依赖

cd ims-web
pnpm install

#### 本地开发

pnpm run dev:ele

#### 构建

pnpm run build:ele

#### nginx 配置

location /ims/ {
alias html/dist/; // 根据实际修改
index index.html index.htm;
try_files $uri $uri/ /ims/index.html;
}

# 跨域配置

location /api {
proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    # 后台接口地址
    proxy_pass http://www.hbwxyh.com/;
    rewrite "^/api/(.*)$" /$1 break;
proxy_redirect default;
add_header Access-Control-Allow-Origin \*;
add_header Access-Control-Allow-Headers X-Requested-With;
add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
}

## 许可证

本项目采用闭源授权模式。具体授权条款请联系版权所有者。
