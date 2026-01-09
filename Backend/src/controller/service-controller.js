import {
  createService,
  findServiceByNameAndCompany,
  companyExists,
} from "../models/services-model.js";

export const createServiceController = async (req, res, next) => {
  try {
    const { name, service_api_key, service_api_id, company_id } = req.body;

    if (!name || !service_api_key || !service_api_id || !company_id) {
      return res.status(400).json({
        success: false,
        message:
          "Service name, service_api_key, service_api_id and company_id are required",
      });
    }

    const company = await companyExists(company_id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const exists = await findServiceByNameAndCompany(
      name,
      service_api_key,
      service_api_id,
      company_id
    );

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Service already exists for this company",
      });
    }

    const serviceId = await createService({
      name,
      service_api_key,
      service_api_id,
      company_id,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: {
        id: serviceId,
        name,
        company_id,
      },
    });
  } catch (error) {
    next(error);
  }
};
