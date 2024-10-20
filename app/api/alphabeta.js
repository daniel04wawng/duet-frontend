import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    // Create a connection to SingleStore
    const connection = await mysql.createConnection({
      host: process.env.SINGLESTORE_HOST, // Replace with your SingleStore host
      user: process.env.SINGLESTORE_USER, // Replace with your SingleStore user
      password: process.env.SINGLESTORE_PASSWORD, // Replace with your SingleStore password
      database: process.env.SINGLESTORE_DATABASE, // Replace with your SingleStore database name
    });

    // Query to get the most recent alpha and beta values
    const [rows] = await connection.query(
      'SELECT alpha, beta, timestamp FROM AlphaBeta ORDER BY timestamp DESC LIMIT 1'
    );

    // If rows are returned, send the most recent one
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'No data found' });
    }

    // Close the database connection
    await connection.end();
  } catch (error) {
    console.error('Error fetching alpha/beta data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}