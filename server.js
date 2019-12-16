const fs = require('fs');
const https = require('https');
const jsonServer = require('json-server');
const faker = require('faker');
const shell = require('shelljs');

const router = jsonServer.router('db.json');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const port = 3002;

function generateUsers() {
  //生成Mock 需要的数据，您可以自定义您需要的数据
  let users = []
  for (let id=1; id <= 100; id++) {
      let name = faker.name.firstName() + faker.name.lastName();
      let title = faker.name.jobTitle();
      users.push({
          "id": id,
          "name": name,
          "title": title
      });
  }
  return { "user": users , "testkevin": [{"id":1}]}
}

const JsonHTTPServer = {
  init: async () => {
    const output = shell.exec(`lsof -i:${port}`)
    if (output.code === 0) {
      const PID = /\nnode\s+(\d+)\s+/.exec(output.stdout)[1]
      shell.exec(`kill -9 ${PID}`)
    }

    // 这段可以定义 node js 传入参数。
    console.log('---------')
    console.log(process.argv)
    if(process.argv.length >0){
        for(const i of process.argv[process.argv.length - 1].split(',')){
            console.log(i)
        }
    }

    //生成使用的数据并存放在  db.json 中
    let dataObj = generateUsers();
    fs.writeFileSync('db.json', JSON.stringify(dataObj, null, '\t'));

    // 生成自定义的 SSL Cert
    var options = {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem')
    };

    //给路由起别名
    server.use(jsonServer.rewriter({
        "/api/*": "/$1",
        "/:resource/:id/show": "/:resource/:id",
        "/posts/:category": "/posts?category=:category",
        "/articles\\?id=:id": "/posts/:id"
      }));

    //定义所有路由的返回值数据
    router.render = function (req, res) {
        //此处可以自定义为您的执行逻辑
        let data = res.locals.data
        console.log('+++++++++++++++++++++')
        console.log(res.statusCode)
        if (res.statusCode >= 400) {
          data = {
            code: res.statusCode,
            message: 'Error'
          }
        }
        res.jsonp(data)
      }

    // 设置指定的路由及其返回值
    server.use(jsonServer.bodyParser)
    server.post('/api/user', (req, res) => {
        if (req.method === 'POST') {
              res.status(400).jsonp({
                error: "Bad userId"
              });
            }else {
            res.status(200).jsonp({
              error: "No valid userId"
            });
          }
        });

    server.use(middlewares);
    server.use(router);

    //自定义端口并启动服务
    https.createServer(options, server).listen(`${port}`, function() {
      console.log("json-server started on port " + `${port}`);
    });
  }
}

JsonHTTPServer.init()

module.exports = server