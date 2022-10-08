import { keys, toPairs, zip } from "lodash";
import { WorkspaceFolder } from "vscode";
import { gitCmd } from "./branchlessCmd";
import exec from "./exec";
import { getCleanLines } from "./getCleanLines";

interface CommitInfo {
  hash: string;
  authorName: string;
  date: Date;
  subject: string;
  refNames: string[];
}

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
): Promise<CommitInfo[]> {
  const [fieldKeys, fieldFormatters] = zip(...toPairs(fields));

  const formatterString = fieldFormatters.join("%x00");

  const output = await exec(
    gitCmd(),
    ["show", `--format=${formatterString}`, ...commits],
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

    return obj;
  });
}
