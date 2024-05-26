var http = require('http');

http.createSever(fuction (req, res) {
  res.write("Im alive");
  res.end();
}).listen(8080);
