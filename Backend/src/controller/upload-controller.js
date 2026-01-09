import { readExcel } from "../services/excel-service.js";
import { callThirdPartyAPI } from "../services/thirdparty-service.js";
import queue from "../services/queue-services.js";

export const uploadAndProcess = async (req, res, next) => {
  try {
    const { service_api_id, center, service_api_key } = req.body;
    // const filePath = req.file.path;
    // console.log(req.file, "File path:", filePath);
    const filePath = "uploads\\1767933997644-upload_sales_Cybrid_HI.xlsx";
    const rows = await readExcel(filePath);

    for (const row of rows) {
      const payload = {
        call_date: row[0],
        msisdn: row[1],
        campaign_id: row[2],
        center,
        filePath,
        filename: filePath,
        service_api_id,
        total_count: rows.length,
      };

      callThirdPartyAPI(payload, service_api_id, service_api_key);
    }

    res.json({
      success: true,
      totalRecords: rows,
      message: "File queued for processing",
    });
  } catch (error) {
    next(error);
  }
};
