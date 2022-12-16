import BranchlessCommand from "../BranchlessCommand";
import { RevsetParam } from "../paramHandlers";

const branchlessSmartlogRevset = new BranchlessCommand(
  "smartlogRevset",
  "smartlog",
  {
    revset: {
      paramHandler: new RevsetParam("A revset specifying the commits to log"),
      isArg: true,
    },
  },
  { noConfirmation: true }
);

export default branchlessSmartlogRevset;
