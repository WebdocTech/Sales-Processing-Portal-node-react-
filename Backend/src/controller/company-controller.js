import {
  createCompany,
  findCompanyByName,
  getAllCompanies,
} from "../models/companies-model.js";

export const createCompanyController = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const exists = await findCompanyByName(name);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Company already exists",
      });
    }

    const companyId = await createCompany(name);

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: {
        id: companyId,
        name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};
export const getCompanies = async (req, res) => {
  try {
    const companies = await getAllCompanies();
    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};
