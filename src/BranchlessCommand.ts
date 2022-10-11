import { mapValues, sortBy, toPairs } from "lodash";
import { z } from "zod";
import {
  CommandDescription,
  CommandParam,
  InferArgType,
} from "./CommandDescription.types";
import getTerminal from "./getTerminal";
import { WorkspaceFolderParam } from "./paramHandlers";
import { DefaultValueParam } from "./paramHandlers";

interface BranchlessCommandParam<T> {
  paramHandler: CommandParam<T>;
  flag?: string;
  isArg?: boolean;
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
    private branchlessParams: Record<string, BranchlessCommandParam<any>>,
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
    const { logAfter = false } = this.options;

    const commandArgString = sortBy(
      toPairs(this.branchlessParams),
      ([_key, { isArg }]) => (isArg ? 1 : 0)
    )
      .map(([key, param]) => getArgString(param, commandArgs[key]))
      .join(" ");

    const showLogCommand = logAfter ? " && git-branchless smartlog" : "";

    terminal.runCommand(
      `git-branchless ${this.command} ${commandArgString}${showLogCommand}`,
      !noConfirmation
    );
  }
}

function getArgString<T>(param: BranchlessCommandParam<T>, value: T) {
  const {
    paramHandler: { schema },
    flag,
    isArg,
  } = param;

  if (isArg) {
    return value;
  }

  if (schema instanceof z.ZodBoolean) {
    return value ? flag : "";
  }

  return `${flag} '${value}'`;
}
