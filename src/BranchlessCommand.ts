import { mapValues, toPairs } from "lodash";
import { z } from "zod";
import {
  CommandDescription,
  CommandParam,
  InferArgType,
} from "./CommandDescription.types";
import getTerminal from "./getTerminal";
import { DefaultValueParam, WorkspaceFolderParam } from "./paramHandlers";

interface BranchlessCommandParam {
  paramHandler: CommandParam<any>;
  flag: string;
}

interface Options {
  logAfter?: boolean;
  noConfirmation?: boolean;
}

interface CoreParams {
  noConfirmation: CommandParam<boolean>;
  workspaceFolder: WorkspaceFolderParam;
}
type BranchlessParams = Record<string, CommandParam<any>>;

type ParamType = CoreParams & BranchlessParams;
type ArgType = InferArgType<ParamType>;

export default class BranchlessCommand
  implements CommandDescription<ParamType>
{
  public params: ParamType;

  constructor(
    public id: string,
    private command: string,
    private branchlessParams: Record<string, BranchlessCommandParam>,
    private options: Options = {}
  ) {
    this.run = this.run.bind(this);

    const { noConfirmation = false } = this.options;

    const coreParams: CoreParams = {
      noConfirmation: new DefaultValueParam(z.boolean(), noConfirmation),
      workspaceFolder: new WorkspaceFolderParam(),
    };
    const branchlessParamMap: BranchlessParams = mapValues(
      this.branchlessParams,
      ({ paramHandler }) => paramHandler
    );

    this.params = {
      ...coreParams,
      ...branchlessParamMap,
    };
  }

  async run({ noConfirmation, workspaceFolder, ...commandArgs }: ArgType) {
    const terminal = getTerminal(workspaceFolder);

    const commandArgString = toPairs(this.branchlessParams)
      .map(([key, { flag }]) => `${flag} '${commandArgs[key]}'`)
      .join(" ");

    const showLogCommand = this.options.logAfter
      ? " && git-branchless smartlog"
      : "";

    terminal.runCommand(
      `git-branchless ${this.command} ${commandArgString}${showLogCommand}`,
      !noConfirmation
    );
  }
}
