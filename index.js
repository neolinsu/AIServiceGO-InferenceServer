require('shelljs/global');
const ws = require('nodejs-websocket');
var fs = require('fs')

app = 'classi01'

function process_data(data) {
  fs.writeFile('temp', data, 'binary', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('The file was saved!');
      exec('scp temp 192.168.0.1:/xxxx', (status, output) => {
        console.log(status);
        console.log(output);
      });
      exec('ssh user@remoteNode "cd /xxxx; xxxx', (status, output) => {
        console.log(status);
        console.log(output);
      });
    }
  });
}

ws.connect('ws://182.92.8.1:8001', (conn) => {
  console.log('Success.');
  conn.on('text', (text) => {
    console.log(text);
    this.app = text;
  })
  conn.on('binary', (inStream) => {
    var data = Buffer.alloc(0);
    // Read chunks of binary data and add to the buffer
    inStream.on('readable', function() {
      var newData = inStream.read();
      if (newData)
        data = Buffer.concat([data, newData], data.length + newData.length);
    })
    inStream.on('end', function() {
      console.log('Received ' + data.length + ' bytes of binary data');
      process_data(data);
    })
  })
})
