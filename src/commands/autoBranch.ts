import slugify from "slugify";
import { workspace } from "vscode";
import { gitCmd } from "../branchlessCmd";
import { CommandDescription } from "../CommandDescription.types";
import exec from "../exec";
import { RevsetParam, WorkspaceFolderParam } from "../paramHandlers";
import runBranchlessQuery from "../runBranchlessQuery";
import showLog from "../showLog";

const params = {
  revset: new RevsetParam(
    "A revset specifying the commits to add branch names to"
  ),
  workspaceFolder: new WorkspaceFolderParam(),
};

const autoBranch: CommandDescription<typeof params> = {
  id: "custom.autoBranch",
  params,
  async run({ revset, workspaceFolder }) {
    const commits = await runBranchlessQuery(
      `(${revset}) - branches()`,
      workspaceFolder
    );

    const prefix =
      workspace
        .getConfiguration("git-branchless")
        .get<string>("branchPrefix") ?? "";

    for (const { hash, subject, isHead } of commits) {
      const branchName =
        prefix + slugify(subject, { lower: true, strict: true });

      await exec(gitCmd(), ["branch", branchName, hash], {
        cwd: workspaceFolder.uri.fsPath,
      });

      if (isHead) {
        await exec(gitCmd(), ["switch", branchName], {
          cwd: workspaceFolder.uri.fsPath,
        });
      }
    }

    showLog(workspaceFolder);
  },
};

export default autoBranch;
