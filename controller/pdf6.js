const path = require("path");
const pdfreader = require("pdfreader");

async function extractPDFData() {
  const filename = "Local1.pdf";
  const pdfPath = path.join(__dirname, "..", "pdffolder", filename);

  const rows = {}; // To group text by rows using Y positions

  const pdfReader = new pdfreader.PdfReader();

  return new Promise((resolve, reject) => {
    pdfReader.parseFileItems(pdfPath, (err, item) => {
      if (err) {
        console.error("PDF read error:", err);
        reject(err);
        return;
      }

      if (!item) {
        // End of file, process rows
        const sortedRows = Object.keys(rows)
          .sort((a, b) => parseFloat(a) - parseFloat(b))
          .map((y) => rows[y]);

        console.log("Sorted Rows:", sortedRows);

        // Convert rows to desired JSON format
        const result = sortedRows.slice(1).map((row) => ({
          name: row[0] || "",
          email: row[1] || "",
          mobileNumber: row[2] || "",
        }));

        resolve(result);
        return;
      }

      if (item.text) {
        const y = item.y.toFixed(2); // Round Y position for grouping
        rows[y] = rows[y] || [];
        rows[y].push(item.text.trim());
      }
    });
  });
}

// Call the function and handle the result
(async () => {
  try {
    const pdfData = await extractPDFData();
    console.log("Extracted Data in Desired Format:", pdfData);
  } catch (err) {
    console.error("Error extracting PDF data:", err);
  }
})();
