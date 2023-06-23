import mysql from "mysql2/promise";

const pool = mysql.createPool(process.env.DATABASE_URL);

export async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
