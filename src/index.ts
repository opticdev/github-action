import * as core from "@actions/core";
import * as exec from "@actions/exec";

const token = core.getInput("token");

async function execCommand(
  ...args: Parameters<typeof exec.exec>
): Promise<boolean> {
  try {
    await exec.exec(...args);
    return true;
  } catch (e) {
    if (e instanceof Error) {
      core.error(e);
    }

    return false;
  }
}

async function runAction(): Promise<void> {
  const valid = await verifyInput();
  if (!valid) {
    return;
  }

  const installed = await install();
  if (!installed) {
    return;
  }

  const contextCreated = await createContext();

  if (!contextCreated) {
    return;
  }

  const comparisonRun = await runComparison();

  if (!comparisonRun) {
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
  core.info("Installing optic-ci");
  return execCommand("npm", [
    "install",
    "--location=global",
    "@useoptic/optic-ci",
  ]);
}

async function createContext(): Promise<boolean> {
  core.info("Generating context file");
  return execCommand("optic-ci", [
    "create-github-context",
    "--provider=github",
  ]);
}

async function runComparison(): Promise<boolean> {
  core.info("Running Optic compare");

  return execCommand("optic-ci", ["run"], {
    env: {
      OPTIC_TOKEN: token,
    },
  });
}

runAction().then(() => null);
