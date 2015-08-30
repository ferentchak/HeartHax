var app = require('./app');
PORT = process.env.PORT || 2001;
app.listen(PORT);

console.log('Server started: http://localhost:2001/');
