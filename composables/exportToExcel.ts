import xlsx from 'xlsx'

let xlsxInstance: typeof xlsx | null = null;

const getInstance = async () => {
  if (!xlsxInstance) xlsxInstance = await import('xlsx')
  return xlsxInstance
}

export const useExportExcel = async (json: unknown[], fileName: string) => {
  const xlsx = await getInstance()
  const worksheet = xlsx.utils.json_to_sheet(json);
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  xlsx.writeFile(workbook, toExportFileName(fileName));
  return true;
}

const toExportFileName = (fileName: string): string => `${fileName}_${new Date().getTime()}.xlsx`