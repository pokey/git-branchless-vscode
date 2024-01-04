import { GitCommandDescription } from "../CommandDescription.types";
import autoBranch from "./autoBranch";
import branchlessHide from "./branchlessHide";
import branchlessMoveExact from "./branchlessMoveExact";
import branchlessMoveSource from "./branchlessMoveSource";
import branchlessSmartlog from "./branchlessSmartlog";
import branchlessSmartlogRevset from "./branchlessSmartlogRevset";
import branchlessSubmit from "./branchlessSubmit";
import branchlessSubmitRevset from "./branchlessSubmitRevset";
import detachHead from "./detachHead";
import moveBranch from "./moveBranch";
import reset from "./reset";
import switchToCommit from "./switchToCommit";

export const commands: GitCommandDescription<any>[] = [
  branchlessMoveExact,
  branchlessMoveSource,
  branchlessSmartlog,
  branchlessSmartlogRevset,
  branchlessSubmit,
  branchlessSubmitRevset,
  autoBranch,
  moveBranch,
  detachHead,
  branchlessHide,
  switchToCommit,
  reset,
];
