import { toPairs, zip } from "lodash";
import { WorkspaceFolder } from "vscode";
import { gitCmd } from "./branchlessCmd";
import Commit, { CommitInfo } from "./Commit";
import { exec } from "./exec";
import { getCleanLines } from "./getCleanLines";

const fields: Record<keyof CommitInfo, string> = {
  hash: "%H",
  authorName: "%an",
  date: "%cI",
  subject: "%s",
  refNames: "%D",
};

export default async function getCommitInfo(
  commits: string[],
  workspaceFolder: WorkspaceFolder
): Promise<Commit[]> {
  // This case prevents us from passing empty list of commits to git, which
  // would cause it to report info about head commit, which is definitely not
  // what we want!
  if (commits.length === 0) {
    return [];
  }

  const [fieldKeys, fieldFormatters] = zip(...toPairs(fields));

  const formatterString = fieldFormatters.join("%x00");

  const output = await exec(
    gitCmd(),
    ["show", "--no-patch", `--format=${formatterString}`, ...commits],
    {
      cwd: workspaceFolder.uri.fsPath,
    }
  );

  return getCleanLines(output).map((line) => {
    const obj = Object.fromEntries(zip(fieldKeys, line.split("\u0000")));

    obj.refNames = obj.refNames
      .split(", ")
      .filter((refName: string) => refName.trim().length > 0);

    obj.date = new Date(obj.date);

    return new Commit(obj);
  });
}
