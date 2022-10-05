import { CommandDescription } from "../CommandDescription.types";

const branchlessMoveExact: CommandDescription = {
  id: "move.exact",
  name: "Move exact",
  command: "move",
  args: [
    {
      key: "exact",
      type: "revset",
      flag: "--exact",
      description: "A revset specifying the commits to be moved",
    },
    {
      key: "destination",
      type: "commitish",
      flag: "--dest",
      description: "A commit-ish to which the commit(s) will be moved",
    },
  ],
};

export default branchlessMoveExact;
