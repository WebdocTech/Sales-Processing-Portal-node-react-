import axios from "axios";
import { saveApiLog } from "./api-logs-service.js";
import {
  incrementSubscriptionSuccessCount,
  incrementSubscriptionFailedCount,
  incrementChargingFailedCount,
  incrementChargingSuccessCount,
} from "../models/sales-upload-model.js";

export async function subscribeAndCharge(
  payload,
  service_api_key,
  service_api_id,
  uploadId,
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
      },
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
      await incrementSubscriptionSuccessCount(uploadId);

      const chargingRequest = { cellno: msisdn };
      try {
        const chargingResponse = await axios.get(
          `${process.env.THIRD_PARTY_API}/${service_api_key}/charging`,
          {
            params: chargingRequest,
            timeout: 60000,
          },
        );
        if (chargingResponse.data === 100) {
          await incrementChargingSuccessCount(uploadId);
        } else {
          await incrementChargingFailedCount(uploadId);
        }
        await saveApiLog({
          apiName: "CallCenter-Charging",
          msisdn,
          requestPayload: chargingRequest,
          responsePayload: chargingResponse.data,
          serviceKey: service_api_key,
        });
      } catch (error) {
        await incrementChargingFailedCount(uploadId);
        await saveApiLog({
          apiName: "CallCenter-Charging-exception",
          msisdn,
          requestPayload: chargingRequest,
          responsePayload: {
            message: error.message,
            code: error.code || "EXCEPTION",
          },
          serviceKey: service_api_key,
        });
      }
    } else {
      await incrementSubscriptionFailedCount(uploadId);
    }
    return true;
  } catch (error) {
    // =========================
    // EXCEPTION LOG
    // =========================
    await incrementSubscriptionFailedCount(uploadId);

    await saveApiLog({
      apiName: "CallCenter-Subscribe-exception",
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
