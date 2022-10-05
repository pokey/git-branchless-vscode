import { CommitishHandler, RevsetHandler } from "../paramHandlers";
import BranchlessCommand from "../BranchlessCommand";

const branchlessMoveExact = new BranchlessCommand("move.exact", "move", {
  exact: {
    paramHandler: new RevsetHandler(
      "A revset specifying the commits to be moved"
    ),
    flag: "--exact",
  },
  destination: {
    paramHandler: new CommitishHandler(
      "A commit-ish to which the commit(s) will be moved"
    ),
    flag: "--dest",
  },
});

export default branchlessMoveExact;
