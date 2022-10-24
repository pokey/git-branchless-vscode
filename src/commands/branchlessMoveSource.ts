import BranchlessCommand from "../BranchlessCommand";
import { CommitishParam } from "../paramHandlers";

const branchlessMoveSource = new BranchlessCommand(
  "move.source",
  "move",
  {
    source: {
      paramHandler: new CommitishParam(
        "A commit-ish specifying the commit to be moved"
      ),
      flag: "--source",
    },
    destination: {
      paramHandler: new CommitishParam(
        "A commit-ish to which the commit(s) will be moved"
      ),
      flag: "--dest",
    },
  },
  { logAfter: true }
);

export default branchlessMoveSource;
