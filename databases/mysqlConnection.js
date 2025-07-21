import { Connector } from '@google-cloud/cloud-sql-connector';
import mysql from 'mysql2/promise';

let db = null;

export async function initializeDB() {
  try {
    const connector = new Connector();

    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
      ipType: 'PUBLIC',
      authType: 'PASSWORD', 
    });

    db = mysql.createPool({
      ...clientOpts,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
    });

    console.log('✅ Connected to MySQL via Cloud SQL Connector');
  } catch (error) {
    console.error('Error connecting to MySQL via Cloud SQL Connector:', error.message);
    throw error;
  }
}

export function getDB() {
  if (!db) throw new Error('Database not initialized. Call initializeDB() first.');
  return db;
}
