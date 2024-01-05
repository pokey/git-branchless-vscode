import { appendFile, mkdir } from "fs/promises";
import { dirname } from "path";

export async function logCall(logPath: string, historyItem: any) {
  const data = JSON.stringify(historyItem) + "\n";

  await mkdir(dirname(logPath), { recursive: true });
  await appendFile(logPath, data, "utf8");
}
