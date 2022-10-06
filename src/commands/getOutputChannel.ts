import * as vscode from "vscode";

function getOutputChannel(): vscode.OutputChannel {
  if (!_channel) {
    _channel = vscode.window.createOutputChannel("Git branchless");
  }
  return _channel;
}
let _channel: vscode.OutputChannel;
