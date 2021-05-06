// require your server and launch it
const server = require('./api/server.js');

server.listen(2019, () => {
  console.log('\n* Server Running on http://localhost:2019 *\n');
});
