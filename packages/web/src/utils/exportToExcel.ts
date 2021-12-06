export class ExportToExcel {
  public export(json: any[], fileName: string): Promise<boolean> {
    return new Promise(resolve => {
      // 按需引入，优化开屏时间
      import('xlsx').then(XLSX => {
        const worksheet:any = XLSX.utils.json_to_sheet(json);
        const workbook:any = {Sheets: {data: worksheet}, SheetNames: ['data']};
        XLSX.writeFile(workbook, ExportToExcel._toExportFileName(fileName));
        resolve(true);
      })
    })

  }

  private static _toExportFileName(fileName: string): string {
    return  `${fileName}_${new Date().getTime()}.xlsx`;
  }
}

