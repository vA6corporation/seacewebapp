import * as XLSX from 'xlsx'

export function buildExcel(body: any[], name: string, wscols: any[] = [], wsrows: any[] = [], merges: any[] = []) {
    const wb = XLSX.utils.book_new()
    wb.Props = {
        Title: "SheetJS Tutorial",
        Subject: "Test",
        Author: "Red Stapler",
        CreatedDate: new Date()
    }
    wb.SheetNames.push("Reporte")
    const ws_data = body
    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    wb.Sheets["Reporte"] = ws

    wscols.forEach((item, index) => {
        wscols[index] = { wch: item }
    })
    ws['!cols'] = wscols

    wsrows = wsrows.map(e => ({ hpx: e }))
    ws['!rows'] = wsrows
    XLSX.writeFile(wb, `${name}.xlsx`)
}