import { CommandDescription } from "../CommandDescription.types";
import branchlessMoveExact from "./branchlessMoveExact";
import branchlessSmartlog from "./branchlessSmartlog";

export const commands: CommandDescription[] = [
  branchlessMoveExact,
  branchlessSmartlog,
];
