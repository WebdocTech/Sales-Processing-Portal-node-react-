import axios from "axios";
import pool from "../config/db.js";

export const callThirdPartyAPI = async (
  payload,
  service_api_id,
  service_api_key
) => {
  try {
    // const response = await axios.post(process.env.THIRD_PARTY_API, payload);
    const subscribeResponse = await axios.get(
      `${process.env.THIRD_PARTY_API}/${service_api_key}/subscribe`,
      {
        params: {
          cellno: `0${payload.msisdn}`,
          subMode: "WEB",
          serviceId: service_api_id,
        },
        timeout: 60000,
      }
    );

    if (
      subscribeResponse.data.responseCode === 100 &&
      subscribeResponse.data.IS_SUBSCRIBED === "Y"
    ) {
      const chargingResponse = await axios.get(
        `${process.env.THIRD_PARTY_API}/${service_api_id}/charging`,
        {
          params: { cellno: `0${payload.msisdn}` },
          timeout: 60000,
        }
      );

      await saveAPILog(
        "Callcenter-charging",
        apiInput,
        chargingResponse.data,
        msisdn
      );
    } else {
      console.log("Third Party API Response:", subscribeResponse.data);
      console.log(`0${payload.msisdn}`, "Processing row payload:", payload);
      return subscribeResponse.data;
    }

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
