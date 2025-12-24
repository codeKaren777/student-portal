const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url'); // Required to handle "luggage tags" (query parameters)

const server = http.createServer((req, res) => {
    // 1. DATA RECEIVER: Catch the registration data from the front-end
    if (req.url === '/register-student' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            console.log('--- NEW DATA RECEIVED ---');
            console.log('Student Info:', JSON.parse(body));
            res.end('Success');
        });
        return;
    }

    // 2. SMART ROUTER: Handle file requests and ignore "luggage tags" (?userName=...)
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
    
    // Create the full path to the file on your computer
    let filePath = path.join(__dirname, pathname);

    // 3. FILE SHIPPER: Send the HTML or CSS to the browser
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log("Error: Could not find file ->", pathname);
            res.statusCode = 404;
            res.end("404: Page Not Found. Please check file spelling.");
            return;
        }
        
        // Identify the file type so the browser knows how to read it
        const ext = path.extname(filePath);
        if (ext === '.css') res.setHeader('Content-Type', 'text/css');
        if (ext === '.html') res.setHeader('Content-Type', 'text/html');

        res.end(data);
    });
});

// 4. DEPLOYMENT READY: Use the internet provider's port OR 3000 locally
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`
    ====================================
    --- UNIVERSITY PORTAL IS ONLINE ---
    Local Access: http://localhost:${PORT}
    Status: Deployment Ready
    ====================================
    `);
});