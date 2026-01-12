import {
  createService,
  findServiceByNameAndCompany,
  findServiceByCompany,
  companyExists,
} from "../models/services-model.js";

export const createServiceController = async (req, res) => {
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
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};
export const getServiceByCompanyController = async (req, res) => {
  try {
    const { company_id } = req.query;
    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: "company_id is required",
      });
    }
    const service = await findServiceByCompany(company_id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found for this company",
      });
    }
    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};
