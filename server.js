var connect = require('connect');

connect.createServer(
    connect.static("../KEMU2-threejs")
    
).listen(8800);