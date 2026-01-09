import ExcelJS from "exceljs";

export const readExcel = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.worksheets[0];
  const rows = [];

  sheet.eachRow((row, index) => {
    if (index === 1) return;
    rows.push(row.values.slice(1));
  });

  return rows;
};
