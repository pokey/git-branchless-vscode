import { mapValues, sortBy, toPairs } from "lodash";
import { z } from "zod";
import { CommandParam, InferArgType } from "./BaseCommandDescription.types";
import { GitCommandDescription } from "./CommandDescription.types";
import Git from "./Git";
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
}
type BranchlessParams = Record<string, CommandParam<any>>;

type ParamType = CoreParams & BranchlessParams;
type ArgType = InferArgType<ParamType> & { git: Git };

export default class BranchlessCommand
  implements GitCommandDescription<ParamType>
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

  run({ noConfirmation, git, ...commandArgs }: ArgType) {
    const { logAfter = false } = this.options;

    const commandArgString = sortBy(
      toPairs(this.branchlessParams),
      ([_key, { isArg }]) => (isArg ? 1 : 0)
    )
      .map(([key, param]) => getArgString(param, commandArgs[key]))
      .join(" ");

    return git.runBranchlessCmdInTerminalAdvanced(this.command, {
      dangerousRawArgString: commandArgString,
      noConfirmation,
      logAfter,
    });
  }
}

function getArgString<T>(param: BranchlessCommandParam<T>, value: T) {
  const {
    paramHandler: { schema },
    flag,
    isArg,
  } = param;

  if (isArg) {
    return `'${value}'`;
  }

  if (schema instanceof z.ZodBoolean) {
    return value ? flag : "";
  }

  return `${flag} '${value}'`;
}
