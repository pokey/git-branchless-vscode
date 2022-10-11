import { CommandDescription } from "../CommandDescription.types";
import Git from "../Git";
import processBranchParam from "../processBranchParam";
import {
  BranchParam,
  CommitishParam,
  WorkspaceFolderParam,
} from "../paramHandlers";

const params = {
  destination: new CommitishParam("The commit to switch to"),
  workspaceFolder: new WorkspaceFolderParam(),
};

const switchToCommit: CommandDescription<typeof params> = {
  id: "custom.switchToCommit",
  params,
  async run({ destination, workspaceFolder }) {
    const git = new Git(workspaceFolder);

    const { hash } = await git.queryOne(destination);

    await git.branchlessSwitch(hash);
  },
};

export default switchToCommit;
