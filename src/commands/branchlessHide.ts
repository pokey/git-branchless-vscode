import { z } from "zod";
import BranchlessCommand from "../BranchlessCommand";
import { DefaultValueParam, RevsetParam } from "../paramHandlers";

const branchlessHide = new BranchlessCommand(
  "hide",
  "hide",
  {
    deleteBranches: {
      paramHandler: new DefaultValueParam(z.boolean(), true),
      flag: "--delete-branches",
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
