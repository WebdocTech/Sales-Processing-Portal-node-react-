import axios from "axios";
import { saveApiLog } from "./api-logs-service.js";
export async function subscribeAndCharge(
  payload,
  service_api_key,
  service_api_id
) {
  const msisdn = `0${payload.msisdn}`;
  const subscribeRequest = {
    cellno: msisdn,
    subMode: "WEB",
    serviceId: service_api_id,
  };

  try {
    // =========================
    // SUBSCRIBE API CALL
    // =========================
    const subscribeResponse = await axios.get(
      `${process.env.THIRD_PARTY_API}/${service_api_key}/subscribe`,
      {
        params: subscribeRequest,
        timeout: 60000,
      }
    );

    // 🔹 LOG SUBSCRIBE RESPONSE
    await saveApiLog({
      apiName: "CallCenter-Subscribe",
      msisdn,
      requestPayload: subscribeRequest,
      responsePayload: subscribeResponse.data,
      serviceKey: service_api_key,
    });

    if (
      subscribeResponse.data.responseCode === 100 &&
      subscribeResponse.data.IS_SUBSCRIBED === "Y"
    ) {
      const chargingRequest = { cellno: msisdn };

      const chargingResponse = await axios.get(
        `${process.env.THIRD_PARTY_API}/${service_api_id}/charging`,
        {
          params: chargingRequest,
          timeout: 60000,
        }
      );

      // 🔹 LOG CHARGING RESPONSE
      await saveApiLog({
        apiName: "CallCenter-Charging",
        msisdn,
        requestPayload: chargingRequest,
        responsePayload: chargingResponse.data,
        serviceKey: service_api_key,
      });
    }
    return true;
  } catch (error) {
    // =========================
    // EXCEPTION LOG
    // =========================
    await saveApiLog({
      apiName: "Callcenter-exception",
      msisdn,
      requestPayload: subscribeRequest,
      responsePayload: {
        message: error.message,
        code: error.code || "EXCEPTION",
      },
      serviceKey: service_api_key,
    });

    return false;
  }
}
