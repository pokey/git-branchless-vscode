import slugify from "slugify";
import { workspace } from "vscode";
import { CommandDescription } from "../CommandDescription.types";
import Git from "../Git";
import { RevsetParam, WorkspaceFolderParam } from "../paramHandlers";

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
    const git = new Git(workspaceFolder);

    const prefix =
      workspace
        .getConfiguration("git-branchless")
        .get<string>("branchPrefix") ?? "";

    const commits = await git.query(`(${revset}) - branches()`);

    for (const { hash, subject, isHead } of commits) {
      const branchName =
        prefix + slugify(subject, { lower: true, strict: true });

      await git.branch(branchName, hash);

      if (isHead) {
        await git.switch(branchName);
      }
    }

    await git.showLog();
  },
};

export default autoBranch;
