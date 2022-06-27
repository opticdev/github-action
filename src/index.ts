import * as core from "@actions/core";
import * as exec from "@actions/exec";

const token = core.getInput("token");

async function runAction(): Promise<void> {
  const valid = verifyInput();
  if (!valid) {
    return;
  }

  const installed = install();
  if (!installed) {
    return;
  }
}

async function verifyInput(): Promise<boolean> {
  if (!token) {
    core.error("No token provided");
    return false;
  }

  return true;
}

async function install() {
  try {
    core.info("Installing optic-ci");

    // todo: wrap github's exec with a standard way to capture input and only
    // show it on error
    await exec.exec("npm", [
      "install",
      "--location=global",
      "@useoptic/optic-ci",
    ]);
  } catch (e) {
    if (e instanceof Error) {
      core.error(e);
    }

    return false;
  }
}

runAction().then(() => null);
