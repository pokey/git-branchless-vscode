import { CommandDescription } from "../CommandDescription.types";
import autoBranch from "./autoBranch";
import branchlessHide from "./branchlessHide";
import branchlessMoveExact from "./branchlessMoveExact";
import branchlessSmartlog from "./branchlessSmartlog";
import detachHead from "./detachHead";
import moveBranch from "./moveBranch";

export const commands: CommandDescription<any>[] = [
  branchlessMoveExact,
  branchlessSmartlog,
  autoBranch,
  moveBranch,
  detachHead,
  branchlessHide,
];
