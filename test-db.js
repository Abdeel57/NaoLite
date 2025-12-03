const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:ViIvNPKcwREbEkOgXuWsNbzpqYRbHSqG@switchback.proxy.rlwy.net:34550/railway',
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => {
        console.log('Connected successfully');
        return client.end();
    })
    .catch(err => {
        console.error('Connection error', err.stack);
        process.exit(1);
    });
