// 封装的mongodb函数
let mongodb = require('mongodb');
let mongoCt = mongodb.MongoClient;  //创建客户端
let ObjectID = mongodb.ObjectID;

// 默认
module.exports = ({
    url = 'mongodb://127.0.0.1:27017',
    dbName = 'local',
    collectionName
},callback) => {
    dbName = dbName || 'local';
    collectionName = collectionName || 'user';

    //  创建连接
    mongoCt.connect(url,{userNewUrlParser:true},(err,client)=>{
        if(!err){
            // 链库
            let db = client.db(dbName);
            //  链接表
            let collection = db.collection(collectionName);
            //  查询
            callback(collection,client,ObjectID)

        }else{
            console.log('连接mongodb服务端失败')
        }
    })
}