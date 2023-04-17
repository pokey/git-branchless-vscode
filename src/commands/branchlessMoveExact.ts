import { z } from "zod";
import BranchlessCommand from "../BranchlessCommand";
import {
  CommitishParam,
  DefaultValueParam,
  RevsetParam,
} from "../paramHandlers";

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
    merge: {
      paramHandler: new DefaultValueParam(z.boolean(), false),
      flag: "--merge",
    },
  },
  { logAfter: true }
);

export default branchlessMoveExact;
