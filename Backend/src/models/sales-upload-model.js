import pool from "../config/db.js";

export async function createSalesUpload({
  filename,
  filePath,
  center,
  service_id,
  service_api_key,
  total_count,
}) {
  const [result] = await pool.query(
    `
    INSERT INTO sales_uploads
    (filename, file_path, center, service_id, service_api_key, total_count)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [filename, filePath, center, service_id, service_api_key, total_count]
  );

  return result.insertId;
}

export async function incrementProcessedCount(uploadId) {
  await pool.query(
    `
    UPDATE sales_uploads
    SET processed_count = processed_count + 1
    WHERE id = ?
    `,
    [uploadId]
  );
}

export async function markUploadCompleted(uploadId) {
  await pool.query(
    `
    UPDATE sales_uploads
    SET status = 'completed',
        completed_at = NOW()
    WHERE id = ?
    `,
    [uploadId]
  );
}

export async function markUploadFailed(uploadId) {
  await pool.query(
    `
    UPDATE sales_uploads
    SET status = 'failed'
    WHERE id = ?
    `,
    [uploadId]
  );
}

export async function getUploadByCenter(center) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM sales_uploads
    WHERE center = ?
    `,
    [center]
  );
  return rows;
}
