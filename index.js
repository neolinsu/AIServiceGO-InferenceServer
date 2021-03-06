require('shelljs/global');
const ws = require('nodejs-websocket');
var fs = require('fs')

app = 'classi01'

function process_data(data, callback) {
  fs.writeFile('temp', data, 'binary', function(err) {
    if (err) {
      console.log(err);
    } else {
      if (app == 'classi01') {
        console.log('The file was saved!');
        exec('expect scp_to.expect', (status, output) => {
          exec('expect run-classi01.expect', (status, output) => {
            exec('expect scp_back.expect', (status, output) => {
              fs.readFile('temp.result', 'utf-8', (err, data) => {
                if (err) throw err;
                console.log(data);
              });
            });
          });
        });
      }
    }
  });
}

var conn = ws.connect('ws://182.92.8.1:8001', () => {
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
      process_data(
          data,
          (output) => {
              conn.sendText(output, (info) => console.log('call back'))});
    })
  })
})
