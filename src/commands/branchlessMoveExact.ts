import { CommitishParam } from "../paramHandlers";
import { RevsetParam } from "../paramHandlers";
import BranchlessCommand from "../BranchlessCommand";

const branchlessMoveExact = new BranchlessCommand(
  "move.exact",
  "move",
  {
    exact: {
      paramHandler: new RevsetParam(
        "A revset specifying the commits to be moved"
      ),
      flag: "--exact",
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

export default branchlessMoveExact;
