import pool from "../config/db.js";

export const createService = async ({
  name,
  service_api_key,
  service_api_id,
  company_id,
}) => {
  const [result] = await pool.query(
    `INSERT INTO services (name, service_api_key,
      service_api_id, company_id)
     VALUES (?, ?, ?, ?)`,
    [name, service_api_key, service_api_id, company_id]
  );
  return result.insertId;
};

export const findServiceByNameAndCompany = async (
  name,
  service_api_key,
  service_api_id,
  company_id
) => {
  const [rows] = await pool.query(
    `SELECT id FROM services 
     WHERE name = ? AND service_api_key = ? AND service_api_id = ? AND company_id = ?
     LIMIT 1`,
    [name, service_api_key, service_api_id, company_id]
  );
  return rows[0];
};
export const findServiceByCompany = async (company_id) => {
  const [rows] = await pool.query(
    `SELECT * FROM services 
     WHERE company_id = ?
     LIMIT 1`,
    [company_id]
  );
  return rows;
};

export const companyExists = async (company_id) => {
  const [rows] = await pool.query(
    "SELECT id FROM companies WHERE id = ? LIMIT 1",
    [company_id]
  );
  return rows[0];
};
export const findServiceByKey = async (name, service_api_key) => {
  const [rows] = await pool.query(
    `SELECT id FROM services 
     WHERE name = ? AND service_api_key = ?
     LIMIT 1`,
    [name, service_api_key]
  );
  return rows[0];
};
