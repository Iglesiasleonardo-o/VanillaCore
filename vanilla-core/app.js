import express from 'express';
import { sessionMiddleware } from './session-middleware.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static( // LET NGINX SERVE STATIC ON PRODUCTION
    './public', { maxAge: 30 * 24 * 60 * 60 * 1000 }) // 30 days cache, change file names for critical updates
);

// app.post("/login", processTokenCreation); // login has to be before sessionMiddleware so anyone can access it
app.use(sessionMiddleware);
// app.put("/password", processAutoLoginAndPasswordChange);
// app.delete("/logout", processTokenDeletion);

export default app;