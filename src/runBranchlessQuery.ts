import { WorkspaceFolder } from "vscode";
import { branchlessCmd } from "./branchlessCmd";
import Commit from "./Commit";
import { exec } from "./exec";
import { getCleanLines } from "./getCleanLines";
import getCommitInfo from "./getCommitInfo";

export default async function runBranchlessQuery(
  revset: string,
  workspaceFolder: WorkspaceFolder
): Promise<Commit[]> {
  const output = await exec(branchlessCmd(), ["query", "-r", revset], {
    cwd: workspaceFolder.uri.fsPath,
  });

  const commits = getCleanLines(output);

  return await getCommitInfo(commits, workspaceFolder);
}
