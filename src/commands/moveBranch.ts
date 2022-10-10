import { CommandDescription } from "../CommandDescription.types";
import Git from "../Git";
import processBranchParam from "../processBranchParam";
import {
  BranchParam,
  CommitishParam,
  WorkspaceFolderParam,
} from "../paramHandlers";

const params = {
  branch: new BranchParam("The branch to move"),
  destination: new CommitishParam("The commit to move the branch to"),
  workspaceFolder: new WorkspaceFolderParam(),
};

const moveBranch: CommandDescription<typeof params> = {
  id: "custom.moveBranch",
  params,
  async run({ branch: rawBranch, destination, workspaceFolder }) {
    const git = new Git(workspaceFolder);

    const branch = await processBranchParam(git, rawBranch);

    const { hash, isHead } = await git.queryOne(destination);

    if (branch === (await git.getCurrentBranch())) {
      await git.detachHead();
    }

    await git.branch("-f", branch, hash);

    if (isHead) {
      await git.switch(branch);
    }

    await git.showLog();
  },
};

export default moveBranch;
