import { CommandDescription } from "../CommandDescription.types";
import Git from "../Git";
import { CommitishParam, WorkspaceFolderParam } from "../paramHandlers";

const params = {
  destination: new CommitishParam("The commit to switch to"),
  workspaceFolder: new WorkspaceFolderParam(),
};

const switchToCommit: CommandDescription<typeof params> = {
  id: "custom.switchToCommit",
  params,
  async run({ destination, workspaceFolder }) {
    const git = new Git(workspaceFolder);

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
