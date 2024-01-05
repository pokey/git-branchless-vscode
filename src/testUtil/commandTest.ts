import Git from "../Git";
import { GitExecutorImpl } from "../GitExecutorImpl";
import Sinon = require("sinon");
import { Call } from "./Call";
import { range } from "lodash";
import assert = require("assert");
import { pairwise } from "itertools";

export function commandTest(run: (git: Git) => Promise<void>, calls: Call[]) {
  return async () => {
    const terminal = {
      runCommand: Sinon.stub(),
    };
    const executor = {
      exec: Sinon.stub(),
      execCheck: Sinon.stub(),
    };

    let execCheckCounter = 0;
    let execCounter = 0;
    let runCommandCounter = 0;

    for (const _ of range(4)) {
      executor.execCheck.onCall(execCheckCounter++).resolves(true);
    }
    for (const call of calls) {
      switch (call.name) {
        case "Executor.exec":
          executor.exec.onCall(execCounter++).resolves(call.result);
          break;
        case "Executor.execCheck":
          executor.execCheck.onCall(execCheckCounter++).resolves(call.result);
          break;
        case "Terminal.runCommand":
          terminal.runCommand.onCall(runCommandCounter++).resolves(undefined);
          break;
      }
    }

    const git = new Git(new GitExecutorImpl(terminal, executor));

    await run(git);

    Sinon.assert.callCount(terminal.runCommand, runCommandCounter);
    Sinon.assert.callCount(executor.exec, execCounter);
    Sinon.assert.callCount(executor.execCheck, execCheckCounter);

    execCounter = 0;
    // Skip initial calls to execCheck
    execCheckCounter = 4;
    runCommandCounter = 0;

    const actualCalls: Sinon.SinonSpyCall[] = [];

    for (const expectedCall of calls) {
      switch (expectedCall.name) {
        case "Executor.exec": {
          const actualCall = executor.exec.getCall(execCounter++);
          assert.deepStrictEqual(actualCall.args, expectedCall.args);
          actualCalls.push(actualCall);
          break;
        }
        case "Executor.execCheck": {
          const actualCall = executor.execCheck.getCall(execCheckCounter++);
          assert.deepStrictEqual(actualCall.args, expectedCall.args);
          actualCalls.push(actualCall);
          break;
        }
        case "Terminal.runCommand": {
          const actualCall = terminal.runCommand.getCall(runCommandCounter++);
          assert.deepStrictEqual(actualCall.args, expectedCall.args);
          actualCalls.push(actualCall);
          break;
        }
      }
    }

    for (const [call1, call2] of pairwise(actualCalls)) {
      assert(call1.calledBefore(call2));
    }
  };
}
