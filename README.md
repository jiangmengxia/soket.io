# soket.io
# 简单的群聊功能


#---------------------前端---------------------------<br/>
#目录：app/client<br/>
#技术：使用webpack+vue+vue-router+socket.io<br/>
#环境只配置了dev,入口文件app/client/main.js<br/>
#端口号初始8000，多启动几个服务一次8081,8082....<br/>
#命令：npm run dev:client<br/>



#---------------------后端---------------------------<br/>
#目录：app/server<br/>
#采用socket.io-client + appCloud云数据库，数据库存放在云端（免费的），请求有点慢<br/>
#端口号设置3000，入口文件app/server/app.js<br/>


#使用concurrently命令可以同时启动前后端服务<br/>
#同时启动前后端服务命令：npm run start<br/>
#体验的时候可以多开几个前端服务，测试多个用户登录体验一下，<br/>
#用户是根据用户名生成的，所以用户名存在的直接登，不存在的会自动创建账号，并自动登录。<br/>
#对后端错误处理机制不是特别了解，所以demo比较简单，<br/>

#个人博客：http://jiangmengxia.github.io
