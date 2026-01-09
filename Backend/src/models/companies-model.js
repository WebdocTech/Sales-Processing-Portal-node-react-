import pool from "../config/db.js";

export const createCompany = async (name) => {
  const [result] = await pool.query("INSERT INTO companies (name) VALUES (?)", [
    name,
  ]);
  return result.insertId;
};

export const findCompanyByName = async (name) => {
  const [rows] = await pool.query(
    "SELECT id FROM companies WHERE name = ? LIMIT 1",
    [name]
  );
  return rows[0];
};
