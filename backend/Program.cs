using System.Data;
using Newtonsoft.Json;
using backend.Models;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Test API");

app.MapPost("/upload", (HttpContext http) =>
{
    UploadExcelFile(http);
    return "uploaded";
});

app.MapGet("/maxsum", (HttpContext http) => {
    databaseContext context = new databaseContext();
    var sum = 0;
    var max = 0;
    try {
        sum = context.PlantaPowers.Sum(p => p.ActivePowerIm);

        max = context.PlantaPowers.Max(p => p.ActivePowerIm);
    }
    catch (Exception e) {
        // should throw an error
    }

    /*String jsonResult = JsonConvert.SerializeObject(result);*/

    http.Response.Headers.ContentType = "application/json";

    return "{\"sum\": " + sum + ", \"max\": " + max + "}";
});

app.MapGet("/devices", (HttpContext http) =>
{
    databaseContext context = new databaseContext();
    var result = context.PlantaPowers.Select(s => s.IdI).Distinct();

    String jsonResult = JsonConvert.SerializeObject(result);

    http.Response.Headers.ContentType = "application/json";

    return jsonResult;
});

app.MapGet("/device/{id}", (int id, HttpContext http) =>
{
    databaseContext context = new databaseContext();
    var result = context.PlantaPowers.Where(w => w.IdI.Equals(id)).Select(s => new { s.FechaIm, s.ActivePowerIm });

    String jsonResult = JsonConvert.SerializeObject(result);

    http.Response.Headers.ContentType = "application/json";

    return jsonResult;
});

// This would be better if it wer asynchronous... but I don't have enough time to do it the right way
void UploadExcelFile(HttpContext http) {
    var file = http.Request.Form.Files.Count > 0 ? http.Request.Form.Files[0] : null;
    if (file == null) {
        // throw an error
        return;
    }

    if (file.ContentType != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        // throw an error
        return;
    }

    var fileNameParts = file.FileName.Split('.');
    if (!String.Equals(fileNameParts[fileNameParts.Count() - 1], "xlsx")) {
        // throw an error
        return;
    }

    string filePath = "./uploads";
    using (Stream fileStream = new FileStream(filePath + "/" + file.FileName, FileMode.Create)) {
        file.CopyToAsync(fileStream);
        ParseExcelFile(filePath + "/" + file.FileName);
    }
}

void ParseExcelFile(String filename) {
    var processExcel = new ProcessExcel(filename);
    DataTable dt = processExcel.ReadWorkBook();

    DataTable parsed = new DataTable();
    var plantaPowers = new List<PlantaPower>();
    parsed.Columns.Add("id_i");
    parsed.Columns.Add("fecha_im");
    parsed.Columns.Add("active_power_im");
    parsed.Columns.Add("division");
    foreach (DataRow row in dt.Rows) {
        int id_i = 0;
        String date = row["fecha_im"].ToString() ?? "";
        DateTime fecha_im = date.Equals("") ? new DateTime() : DateTime.Parse(date);
        int active_power_im = 0;
        // Not a valid number
        if (!int.TryParse(row["id_i"].ToString(), out id_i) || !int.TryParse(row["active_power_im"].ToString(), out active_power_im)) {
            continue;
        }

        // If not blank, add it to the rows
        if (!String.IsNullOrEmpty(row["id_i"].ToString())) {
            DataRow toInsert = parsed.NewRow();
            toInsert["id_i"] = id_i;
            toInsert["fecha_im"] = fecha_im;
            toInsert["active_power_im"] = active_power_im;
            toInsert["division"] = (float) active_power_im / id_i;
            plantaPowers.Add(new PlantaPower
            {
                IdI = id_i,
                FechaIm = fecha_im,
                ActivePowerIm = active_power_im,
                Division = (float) active_power_im / (float) id_i
            });
            parsed.Rows.Add(toInsert);
        }
        else {
            continue;
        }
    }

    SaveResultsToDatabase(plantaPowers);
}

void SaveResultsToDatabase(List<PlantaPower> plantaPowers) {
    databaseContext context = new databaseContext();
    plantaPowers.ForEach(s => context.PlantaPowers.Add(s));
    context.SaveChanges();
}

app.Run();
