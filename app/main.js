const net = require("net");

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
    if (path === "/") {
      httpResponse = "HTTP/1.1 200 OK\r\n\r\n";
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
