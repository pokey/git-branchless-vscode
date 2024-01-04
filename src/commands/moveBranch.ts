import { GitCommandDescription } from "../CommandDescription.types";
import { BranchParam, CommitishParam } from "../paramHandlers";
import processBranchParam from "../processBranchParam";

const params = {
  branch: new BranchParam("The branch to move"),
  destination: new CommitishParam("The commit to move the branch to"),
};

const moveBranch: GitCommandDescription<typeof params> = {
  id: "custom.moveBranch",
  params,
  async run({ branch: rawBranch, destination, git }) {
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
