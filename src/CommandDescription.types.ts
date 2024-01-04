import {
  BaseCommandDescription,
  InferArgType,
  ParamMap,
} from "./BaseCommandDescription.types";
import Git from "./Git";

export interface GitCommandDescription<T extends ParamMap>
  extends BaseCommandDescription<T> {
  run(arg: InferArgType<T> & { git: Git }): Promise<unknown>;
}
