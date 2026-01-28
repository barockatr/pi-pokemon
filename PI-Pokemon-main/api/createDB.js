const { Client } = require('pg');
require('dotenv').config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

async function createDatabase() {
    const client = new Client({
        user: DB_USER,
        host: DB_HOST,
        password: DB_PASSWORD,
        port: DB_PORT,
        database: 'postgres' // Connect to default database to create others
    });

    try {
        await client.connect();
        // Check if database exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname='pokemon'");
        if (res.rowCount === 0) {
            await client.query('CREATE DATABASE pokemon');
            console.log('Database "pokemon" created successfully');
        } else {
            console.log('Database "pokemon" already exists');
        }
    } catch (error) {
        console.error('Error creating database:', error);
    } finally {
        await client.end();
    }
}

createDatabase();
