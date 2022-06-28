"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const token = core.getInput("token");
async function execCommand(...args) {
    try {
        await exec.exec(...args);
        return true;
    }
    catch (e) {
        if (e instanceof Error) {
            core.error(e);
        }
        return false;
    }
}
async function runAction() {
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
async function verifyInput() {
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
        "-g",
        "@useoptic/optic-ci",
    ]);
}
async function createContext() {
    core.info("Generating context file");
    return execCommand("optic-ci", [
        "create-github-context",
        "--provider=github",
    ]);
}
async function runComparison() {
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
//# sourceMappingURL=index.js.map