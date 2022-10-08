import { WorkspaceFolder } from "vscode";
import { branchlessCmd } from "./branchlessCmd";
import exec from "./exec";
import { getCleanLines } from "./getCleanLines";

export default async function runBranchlessQuery(
  revset: string,
  workspaceFolder: WorkspaceFolder
) {
  const output = await exec(branchlessCmd(), ["query", "-r", revset], {
    cwd: workspaceFolder.uri.fsPath,
  });

  return getCleanLines(output);
}
