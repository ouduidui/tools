import * as XLSX from 'xlsx';

export class ExportToExcel {
  public export(json: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {data: worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, ExportToExcel._toExportFileName(fileName));
  }

  private static _toExportFileName(fileName: string): string {
    return  `${fileName}_${new Date().getTime()}.xlsx`;
  }
}

