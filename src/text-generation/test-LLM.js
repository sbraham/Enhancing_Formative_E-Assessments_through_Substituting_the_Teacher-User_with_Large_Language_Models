import { SWQG } from "./LM-studio-helper";
import * as XLSX from 'https://unpkg.com/xlsx/dist/xlsx.full.min.js';
const XLSX = require('xlsx');

// Step 3: Create a workbook
let workbook = XLSX.utils.book_new();

// Step 4: Create a worksheet
let worksheet = XLSX.utils.aoa_to_sheet([
  ['Header1', 'Header2', 'Header3'],
  ['Data1', 'Data2', 'Data3'],
  ['Data4', 'Data5', 'Data6']
]);

// Step 5: Add the worksheet to the workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

// Step 6: Write the workbook to a file
XLSX.writeFile(workbook, 'Spreadsheet.xlsx');