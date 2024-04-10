/* A very simple webserver that serves static files from the current directory
 *
 * Serve files from the current directory on a random port.
 * The port is printed to the console, and the default browser is launched.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Get the directory argument from the command line
const rootDir = process.argv[2];
if (rootDir) {
  process.chdir(rootDir);
}

const server = http.createServer((req, res) => {
  // Construct the file path based on the directory argument
  const filePath = path.join(
    process.cwd(),
    req.url === "/" ? "index.html" : req.url
  );

  // MIME type must be set properly at least for JS or the browser won't execute it
  let contentType = "text/html";
  switch (path.extname(filePath)) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
  }

  console.log(`Serving ${filePath} with content type ${contentType}`);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("File not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

server.listen(0, () => {
  // listening on port 0 will assign a random port
  const port = server.address().port;
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Serving content from ${process.cwd()}`);
  console.log(`Launching browser...`);
  console.log(`Press Ctrl+C to stop the server`);
  const openCommand =
    process.platform === "win32"
      ? "start"
      : process.platform === "darwin"
      ? "open"
      : "xdg-open";
  exec(`${openCommand} http://localhost:${port}`);
});
