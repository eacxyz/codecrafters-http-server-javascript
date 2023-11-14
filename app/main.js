const net = require("net");
const path1 = require("path");
const fs = require("fs");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const content = data.toString();
    const requestLines = content.split("\r\n");
    const startLineParts = requestLines[0].split(" ");
    const path = startLineParts[1];
    
    let httpResponse;
    
    const args = process.argv;
    let dirPath = "";
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "--directory" && args[i + 1]) {
        dirPath = args[i + 1];
        break;
      }
    }
    
    if (path === "/") {
      httpResponse = "HTTP/1.1 200 OK\r\n\r\n";
    } else if (path.includes("/echo/")) {
      const pathParts = path.split("echo/");
      const randomStr = pathParts[1];
      httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-length: ${randomStr.length}\r\n\r\n${randomStr}`;
    } else if (path.includes("user-agent")) {
      const userAgentParts = requestLines[2].split(" ");
      const userAgent = userAgentParts[1];
      httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-length: ${userAgent.length}\r\n\r\n${userAgent}`;
    } else if (path.includes("/files/")) {
      const fileName = path.split("files/")[1];
      const filePath = path1.join(dirPath, fileName);
      console.log(filePath);
      fs.readFile(filePath, (err, data) => {
        if (data) {
          httpResponse = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${data.length}\r\n\r\n${data}`;
        } else {
          httpResponse = "HTTP/1.1 404 Not Found\r\n\r\n";
        }
      });
    } else {
      httpResponse = "HTTP/1.1 404 Not Found\r\n\r\n";
    }
    socket.write(httpResponse);
    socket.end();
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
