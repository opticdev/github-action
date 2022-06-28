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
    return process.exit(1);
  }

  const installed = await install();
  if (!installed) {
    return process.exit(1);
  }

  const contextCreated = await createContext();

  if (!contextCreated) {
    return process.exit(1);
  }

  const comparisonRun = await runComparison();

  if (!comparisonRun) {
    return process.exit(1);
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
  return execCommand("npm", ["install", "-g", "@useoptic/optic-ci"]);
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

runAction()
  .then(() => {
    return process.exit(0);
  })
  .catch(() => {
    return process.exit(1);
  });
