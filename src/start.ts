import { PrideClient } from "./core/PrideClient";
import { ConfigHandler } from "./core/ConfigHandler";
import { CmdHandler } from "./core/CmdHandler";
import { Config, ConfigExample } from "./interfaces/Config";
import { EventHandler } from "./core/EventHandler";

if (Number(process.versions.node.substring(0, process.versions.node.indexOf("."))) < 14) {
    console.error(`![NodeJS Version Check] Required Node version >= 14, you are currently running >>${process.version}<<
    As a result, some functions of Pride will not run properly. Please update your Node version.`);
    process.exit(1);
}

let cfg: Config;

try {
    cfg = ConfigHandler.loadConfig<Config>("config");
} catch (error) {
    ConfigHandler.createConfig("config", ConfigExample);
    console.log("![Configuration] Configuration file has been created. Provide your Discord Token and restart.");
    process.exit(1);
}

try {
    CmdHandler.cmdPrefix = cfg.prefix;
    CmdHandler.loadCmdList();
} catch (error) {
    console.error(`![CmdInit] An Error has occurred during command loading: ${error}`);
    process.exit(1);
}

try {
    EventHandler.loadEvents();
} catch (error) {
    console.error(`![EventLoading] An Error has occurred during event loading: ${error}`);
}

PrideClient.loginClient(cfg.token);

try {
    EventHandler.registerEvents();
} catch (error) {
    console.error(`![EventRegister] An Error has occurred during event registering: ${error}`);
}
