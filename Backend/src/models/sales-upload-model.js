import pool from "../config/db.js";

export async function createSalesUpload({
  filename,
  filePath,
  center,
  service_id,
  service_api_key,
  total_count,
}) {
  const uploadedAt = new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Karachi",
  });
  const [result] = await pool.query(
    `
    INSERT INTO sales_uploads
    (filename, file_path, center, service_id, service_api_key, total_count, uploaded_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      filename,
      filePath,
      center,
      service_id,
      service_api_key,
      total_count,
      uploadedAt,
    ],
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
    [uploadId],
  );
}

export async function markUploadCompleted(uploadId) {
  const completedAt = new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Karachi",
  }); // 🔥 UTC

  await pool.query(
    `
    UPDATE sales_uploads
    SET status = 'completed',
        completed_at = ?
    WHERE id = ?
    `,
    [completedAt, uploadId],
  );
}

export async function markUploadFailed(uploadId) {
  await pool.query(
    `
    UPDATE sales_uploads
    SET status = 'failed'
    WHERE id = ?
    `,
    [uploadId],
  );
}

export async function getUploadByCenter(center, service_id) {
  const [rows] = await pool.query(
    `SELECT 
    id,
    filename,
    file_path,
    center,
    service_id,
    service_api_key,
    total_count,
    processed_count,
    status,
    DATE_FORMAT(uploaded_at, '%Y-%m-%d %H:%i:%s') as uploaded_at,
    DATE_FORMAT(completed_at, '%Y-%m-%d %H:%i:%s') as completed_at
   FROM sales_uploads
   WHERE center = ? AND service_id = ?`,
    [center, service_id],
  );
  return rows;
}
