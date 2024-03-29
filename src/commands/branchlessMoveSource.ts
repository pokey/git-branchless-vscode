import { z } from "zod";
import BranchlessCommand from "../BranchlessCommand";
import { CommitishParam, DefaultValueParam } from "../paramHandlers";

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
    merge: {
      paramHandler: new DefaultValueParam(z.boolean(), false),
      flag: "--merge",
    },
    insert: {
      paramHandler: new DefaultValueParam(z.boolean(), false),
      flag: "--insert",
    },
  },
  { logAfter: true }
);

export default branchlessMoveSource;
