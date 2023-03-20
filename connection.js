const { createConnection } = require("net");

function checkTCPConnection(host, port) {
    return new Promise((resolve, reject) => {
      const client = createConnection({ host, port }, () => {
        console.log(`TCP connection established on port ${port}`);
        client.end();
        resolve();
      });
  
      client.setTimeout(3000);
  
      client.on("timeout", err => {
        console.error(`TCP connection on port ${port} timed out`);
        client.destroy();
        reject(err);
      });
  
      client.on("error", err => {
        console.error(`Error trying to connect via TCP on port ${port}`);
        reject(err);
      });
    });
  }

module.exports = {checkTCPConnection}