import { CommandDescription } from "../CommandDescription.types";
import { RevsetHandler } from "../paramHandlers";
import handleCommandArg from "./handleCommandArg";

const paramMap = {
  revset: new RevsetHandler(
    "A revset specifying the commits to add branch names to"
  ),
};

const autoBranch: CommandDescription = {
  id: "custom.autoBranch",
  async run(rawArg?) {
    const arg = await handleCommandArg(paramMap, rawArg);

    if (arg == null) {
      // User canceled
      return;
    }

    const { revset } = arg;

    console.log(revset);
  },
};

export default autoBranch;
