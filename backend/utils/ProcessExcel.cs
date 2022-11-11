using ClosedXML.Excel;
using System.Data;

public class ProcessExcel {
    private XLWorkbook _workBook;

    // Open the excel file
    public ProcessExcel(string filename) {
        _workBook = new XLWorkbook(filename);
    }

    // Read the data in a specific sheet
    public DataTable ReadWorksheet(String name) {
        var workSheet = _workBook.Worksheet(name);

        DataTable dt = new DataTable();

        List<int> columnsToUse = new List<int>();
        bool firstRow = true;
        foreach(IXLRow row in workSheet.Rows()) {
            if (firstRow) {
                // Get the column names
                foreach (IXLCell cell in row.Cells()) {
                    var i = 0;

                    if (!String.IsNullOrEmpty(cell.Value.ToString())) {
                        dt.Columns.Add(cell.Value.ToString());
                    }
                    else {
                        break;
                    }

                    columnsToUse.Add(i);
                    i++;
                }
                firstRow = false;
            }
            else
            {
                DataRow toInsert = dt.NewRow();
                var i = 0;
                foreach (IXLCell cell in row.Cells(1, workSheet.Columns().Count()))
                {
                    try {
                        if (!String.IsNullOrEmpty(cell.Value.ToString())) {
                            toInsert[i] = cell.Value.ToString();
                        }
                    }
                    catch (Exception e) {
                        // TODO: add exception handling
                    }
                    i++;
                }
                dt.Rows.Add(toInsert);
            }
        }

        return dt;
    }
}
