import { createServer } from 'http'; // Changed from 'https'
import './vanilla-core/mongo.js'; //init mongo here 
// import './redis.js'; //if fast auth is needed
import app from './vanilla-core/app.js';

// No serverOptions needed for HTTP
const server = createServer(app);

// Standard HTTP port is 80, or 3000 for local dev
const PORT = 80; 
const HOST = "localhost"; 

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
});

// npx @tailwindcss/cli -i ./tailwind/input.css -o ./public/css/style.css --watch