// import { readExcel } from "../services/excel-service.js";
// import { subscribeAndCharge } from "../services/subscribe-and-charge-service.js";

// export const uploadAndProcess = async (req, res, next) => {
//   try {
//     const { service_api_id, center, service_api_key } = req.body;
//     const filePath = req.file.path;
//     const rows = await readExcel(filePath);

//     for (const row of rows) {
//       const payload = {
//         call_date: row[0],
//         msisdn: row[1],
//         campaign_id: row[2],
//         center,
//         filePath,
//         filename: filePath,
//         total_count: rows.length,
//       };

//       subscribeAndCharge(payload, service_api_id, service_api_key);
//     }

//     res.json({
//       success: true,
//       totalRecords: rows,
//       message: "File queued for processing",
//     });
//   } catch (error) {
//     next(error);
//   }
// };
import fs from "fs";
import { readExcel } from "../services/excel-service.js";
import { subscribeAndCharge } from "../services/subscribe-and-charge-service.js";
import { apiQueue } from "../services/queue-services.js";
import {
  createSalesUpload,
  incrementProcessedCount,
  markUploadCompleted,
  getUploadByCenter,
} from "../models/sales-upload-model.js";
import pool from "../config/db.js";
export const uploadAndProcess = async (req, res) => {
  try {
    const { service_id, service_api_id, center, service_api_key } = req.body;
    const filePath = req.file.path;
    const filename = req.file.originalname;

    const rows = await readExcel(filePath);

    // 1️⃣ Create upload record
    const uploadId = await createSalesUpload({
      filename,
      filePath,
      center,
      service_id,
      service_api_key,
      total_count: rows.length,
    });
    // 2️⃣ Queue jobs (10/sec)
    rows.forEach((row) => {
      apiQueue.add(async () => {
        const payload = {
          call_date: row[0],
          msisdn: row[1],
          campaign_id: row[2],
          center,
        };

        const success = await subscribeAndCharge(
          payload,
          service_api_key,
          service_api_id
        );

        await incrementProcessedCount(uploadId);

        // 3️⃣ If all done → mark completed
        const [rowsCount] = await pool.query(
          `SELECT processed_count, total_count FROM sales_uploads WHERE id = ?`,
          [uploadId]
        );

        if (rowsCount[0].processed_count === rowsCount[0].total_count) {
          await markUploadCompleted(uploadId);
          fs.unlinkSync(filePath); // delete file
        }
      });
    });

    res.json({
      success: true,
      uploadId,
      totalRecords: rows.length,
      message: "File processing started",
    });
  } catch (error) {
    console.error("Upload and process error:", error);
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};
export const getUploadsByCenter = async (req, res) => {
  try {
    const { center } = req.query;
    const uploads = await getUploadByCenter(center);

    res.json({
      success: true,
      uploads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};
