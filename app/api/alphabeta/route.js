import mysql from 'mysql2/promise';

// Create a connection to SingleStore
const pool = mysql.createPool({
  host: process.env.SINGLESTORE_HOST, // Replace with your SingleStore host
  user: process.env.SINGLESTORE_USER, // Replace with your SingleStore user
  password: process.env.SINGLESTORE_PASSWORD, // Replace with your SingleStore password
  database: process.env.SINGLESTORE_DATABASE, // Replace with your SingleStore database name
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

export async function GET(req) {
  try {
    const connection = await pool.getConnection();

    // Query to get the most recent alpha and beta values
    const rows = await connection.query(
      'SELECT avg_alpha, avg_beta FROM brain_wave_data ORDER BY timestamp DESC LIMIT 1'
    );

    console.log(rows[0][0]);

    // Close the database connection
    connection.release();

    // If rows are returned, send the most recent one
    if (rows.length > 0) {
      return new Response(JSON.stringify(rows[0][0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'No data found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error fetching alpha/beta data:', error);
    return new Response(
      JSON.stringify({ message: 'Server error', error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
