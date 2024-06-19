import { utils, writeFile } from "xlsx";

export function exportToExcel(data) {
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Tez Metaverileri");
  writeFile(wb, "Tez Metaverileri.xlsx");
}
