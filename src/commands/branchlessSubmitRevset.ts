import { z } from "zod";
import BranchlessCommand from "../BranchlessCommand";
import { DefaultValueParam, RevsetParam } from "../paramHandlers";

const branchlessSubmitRevset = new BranchlessCommand(
  "submitRevset",
  "submit",
  {
    revset: {
      paramHandler: new RevsetParam(
        "A revset specifying the commits to submit"
      ),
      isArg: true,
    },
    create: {
      paramHandler: new DefaultValueParam(z.boolean(), false),
      flag: "--create",
    },
  },
  { logAfter: false, noConfirmation: true }
);

export default branchlessSubmitRevset;
