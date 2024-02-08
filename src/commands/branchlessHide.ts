import { z } from "zod";
import BranchlessCommand from "../BranchlessCommand";
import { DefaultValueParam, RevsetParam } from "../paramHandlers";

const branchlessHide = new BranchlessCommand(
  "hide",
  "hide",
  {
    noDeleteBranches: {
      paramHandler: new DefaultValueParam(z.boolean(), false),
      flag: "--no-delete-branches",
    },
    revset: {
      paramHandler: new RevsetParam(
        "A revset specifying the commits to be hidden"
      ),
      isArg: true,
    },
  },
  { noConfirmation: true, logAfter: true }
);

export default branchlessHide;
