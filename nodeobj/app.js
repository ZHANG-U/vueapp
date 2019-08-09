var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let multer = require('multer');
let cookieSession = require('cookie-session');
let cors = require('cors')


// 服务器的搭建
var app = express();
//  静态资源的托管
app.use(express.static(path.join(__dirname, 'public','template'))); 
// 托管多个资源 起别名
app.use('/admin',express.static(path.join(__dirname, 'public','admin')));   //use后面的/admin是自己起的一个别名
// 托管本身文件以外的 （要记得各自的天是谁）
app.use(express.static(path.join(__dirname, 'public'))); 



// 中间件的配置(后端)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //body-parse 脚手架里有
app.use(cookieParser());

app.use(cookieSession({
  name:'1905_session',
  keys:['jia','mi'],  //加密一种轮询方式
  maxAge:1000*60*60*24
}))

var storage = multer.diskStorage({
  destination:function(req,file,cb){
    if(req.url.indexOf('user')!==-1 || req.url.indexOf('reg')!==-1){
      cb(null, path.join(__dirname, 'public','upload','user'))
    }else if(req.url.indexOf('banner')!==-1){
      cb(null, path.join(__dirname, 'public','upload','banner'))
    }else{
      cb(null, path.join(__dirname, 'public/upload/product'))
    }  
  }
})
let multerObj = multer({storage});
// let multerObj = multer({dest:'字符路径'}); 存储方式dest指定死了， 后用storage分目录
app.use(multerObj.any())

app.use(cors({
  "origin": ['http://127.0.0.1:8054'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders:['Content-Type', 'Authorization']
}));

//  响应
//  admin 管理端接口
// app.use('/users', require('./routes/users'));
app.use('/admin/banner', require('./routes/admin/banner')); //交给前端渲染



//  api 用户端接口
app.all('/api/*',require('./routes/api/params'))

app.use('/api/user',require('./routes/api/user'));
app.use('/api/login',require('./routes/api/login'));
app.use('/api/reg',require('./routes/api/reg'));
app.use('/api/logout',require('./routes/api/logout'));
app.use('/api/product',require('./routes/api/product'));
app.use('/api/banner',require('./routes/api/banner'));
app.use('/api/home',require('./routes/api/home'));
app.use('/api/dongtai',require('./routes/api/dongtai'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler(渲染错误信息)
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error'); 直接返回错误路径
  res.send({err:1,msg:'错误的接口，请重试尝试'}) //返回给前端能看懂的错误信息

});

module.exports = app;
