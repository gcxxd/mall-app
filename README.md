# mall-app

## 基于vue.js和Node.js的商城网站
前端使用vue-cli进行搭建，后台使用Node.js以及express框架搭建，数据库使用mongoDB.未登录状态只能浏览商城，登录之后可以下订单，加入购物车，编辑收货地址等。
>![image text](https://github.com/gcxxd/mall-app/raw/master/img/sc1.jpg)
>![image text](https://github.com/gcxxd/mall-app/raw/master/img/sc2.jpg)
>![image text](https://github.com/gcxxd/mall-app/raw/master/img/sc3.jpg)
>![image text](https://github.com/gcxxd/mall-app/raw/master/img/sc4.jpg)
>![image text](https://github.com/gcxxd/mall-app/raw/master/img/sc5.jpg)
>![image text](https://github.com/gcxxd/mall-app/raw/master/img/sc6.jpg)
## 安装与运行

``` bash
# 安装依赖
npm install 
# 客户端运行访问localhost:8989
控制台进入项目根目录下输入：npm run dev
# 服务端运行,控制台进入server/bin目录下输入:
node www

# build for production and view the bundle analyzer report
npm run build --report
