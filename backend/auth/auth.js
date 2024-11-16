import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const basicAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('Unauthorized');
    }
    const base64Credentials = authHeader.split(' ')[1];
    const [username, password] = Buffer.from(base64Credentials, 'base64').toString('ascii').split(':');
    
    // Validate credentials using environment variables (no hardcoding)
    const validUsername = process.env.AUTH_USERNAME; // Set in .env file
    const validPassword = process.env.AUTH_PASSWORD; // Set in .env file

    if (username === validUsername && password === validPassword) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};
