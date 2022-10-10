import { CommandDescription } from "../CommandDescription.types";
import autoBranch from "./autoBranch";
import branchlessMoveExact from "./branchlessMoveExact";
import branchlessSmartlog from "./branchlessSmartlog";
import moveBranch from "./moveBranch";

export const commands: CommandDescription<any>[] = [
  branchlessMoveExact,
  branchlessSmartlog,
  autoBranch,
  moveBranch,
];
