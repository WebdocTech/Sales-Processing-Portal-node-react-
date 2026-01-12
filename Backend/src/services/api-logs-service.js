import pool from "../config/db.js";
export async function saveApiLog({
  apiName,
  msisdn,
  requestPayload,
  responsePayload,
  serviceKey,
}) {
  const query = `
    INSERT INTO api_logs
    (api_name, msisdn, request_payload, response_payload, service_key)
    VALUES (?, ?, ?, ?, ?)
  `;

  await pool.query(query, [
    apiName,
    msisdn || null,
    JSON.stringify(requestPayload || {}),
    JSON.stringify(responsePayload || {}),
    serviceKey,
  ]);
}
