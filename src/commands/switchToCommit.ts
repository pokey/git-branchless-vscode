import { GitCommandDescription } from "../CommandDescription.types";
import { CommitishParam } from "../paramHandlers";

const params = {
  destination: new CommitishParam("The commit to switch to"),
};

const switchToCommit: GitCommandDescription<typeof params> = {
  id: "custom.switchToCommit",
  params,
  async run({ destination, git }) {
    const unwrappedDestination =
      destination.startsWith('"') && destination.endsWith('"')
        ? destination.slice(1, -1)
        : destination;
    const branchlessArg = (await git.isBranch(unwrappedDestination))
      ? unwrappedDestination
      : (await git.queryOne(destination)).hash;

    await git.branchlessSwitch(branchlessArg);
  },
};

export default switchToCommit;
