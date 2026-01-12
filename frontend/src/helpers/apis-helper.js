import { BASE_URL } from "../config.js";
export const getAllCompanies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/companies`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};
export const getAllServices = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/services?company_id=${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};
