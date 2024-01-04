import { GitCommandDescription } from "../CommandDescription.types";
import { CommitishParam } from "../paramHandlers";
import ChoiceParam from "../paramHandlers/ChoiceParam";

const params = {
  source: new CommitishParam(
    "The source commit-ish specifying the desired state of the working tree"
  ),
  destination: new CommitishParam(
    "The destination commit-ish indicating the desired parent"
  ),
  type: new ChoiceParam("The type of reset", ["mixed", "soft", "hard"]),
};

const reset: GitCommandDescription<typeof params> = {
  id: "custom.reset",
  params,
  async run({ source, destination, type, git }) {
    if (!(await git.isClean())) {
      throw new Error("Working tree is not clean; please commit changes first");
    }

    const sourceCommit = (await git.queryOne(source)).hash;
    const destinationCommit = (await git.queryOne(destination)).hash;

    await git.checkout(sourceCommit);
    await git.reset(`--${type}`, destinationCommit);

    await git.showLog();
  },
};

export default reset;
