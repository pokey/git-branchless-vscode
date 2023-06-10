import { CommandDescription } from "../CommandDescription.types";
import Git from "../Git";
import { CommitishParam, WorkspaceFolderParam } from "../paramHandlers";

const params = {
  source: new CommitishParam(
    "A commit-ish specifying the desired state of the working tree"
  ),
  destination: new CommitishParam("A commit-ish specifying the desired parent"),
  workspaceFolder: new WorkspaceFolderParam(),
};

const resetSoft: CommandDescription<typeof params> = {
  id: "custom.resetSoft",
  params,
  async run({ source, destination, workspaceFolder }) {
    const git = new Git(workspaceFolder);

    if (!(await git.isClean())) {
      throw new Error("Working tree is not clean; please commit changes first");
    }

    const sourceCommit = (await git.queryOne(source)).hash;
    const destinationCommit = (await git.queryOne(destination)).hash;

    await git.checkout(sourceCommit);
    await git.reset("--soft", destinationCommit);

    await git.showLog();
  },
};

export default resetSoft;
