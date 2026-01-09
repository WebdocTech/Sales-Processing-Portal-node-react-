import axios from "axios";
import pool from "../config/db.js";

export const callThirdPartyAPI = async (payload) => {
  try {
    // const response = await axios.post(process.env.THIRD_PARTY_API, payload);
    console.log("Processing row payload:", payload);
    return;
    await pool.query(
      `INSERT INTO Process_API_Logs 
      (service_id, request_payload, response_payload, status)
      VALUES (?, ?, ?, ?)`,
      [
        serviceId,
        JSON.stringify(payload),
        JSON.stringify(response.data),
        "SUCCESS",
      ]
    );

    return response.data;
  } catch (error) {
    await pool.query(
      `INSERT INTO Process_API_Logs 
      (service_id, request_payload, error_message, status)
      VALUES (?, ?, ?, ?)`,
      [serviceId, JSON.stringify(payload), error.message, "FAILED"]
    );

    throw error;
  }
};
