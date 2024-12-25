const pool = require("./config/db"); // Import your pool connection

async function checkTableStructure() {
  try {
    const tableName = "products"; // Replace with your table name

    const result = await pool.query(
      `
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1;
    `,
      [tableName]
    );

    console.log(`Structure of table "${tableName}":`);
    console.table(result.rows);
  } catch (err) {
    console.error("Error querying table structure:", err.message);
  } finally {
    pool.end(); // Close the pool connection
  }
}

checkTableStructure();
