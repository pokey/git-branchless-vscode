import Commit from "./Commit";
import GitExecutor from "./GitExecutor";
import { getCleanLines } from "./getCleanLines";
import getCommitInfo from "./getCommitInfo";

export default async function runBranchlessQuery(
  executor: GitExecutor,
  revset: string
): Promise<Commit[]> {
  const commits = getCleanLines(
    await executor.runBranchlessCmd("query", "-r", revset)
  );

  return await getCommitInfo(executor, commits);
}
