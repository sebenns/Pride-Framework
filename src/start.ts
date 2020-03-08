import {PrideClient} from './core/PrideClient';
import {ConfigHandler} from './core/ConfigHandler';
import {CmdHandler} from './core/CmdHandler';
import {Config, ConfigExample} from './interfaces/Config';
import {EventHandler} from './core/EventHandler';

let cfg: Config;

// Loads the configuration file, if it does not exist, it will be created.
try
{
    cfg = ConfigHandler.loadConfig<Config>('config');
}
catch (error)
{
    ConfigHandler.createConfigFile('config', ConfigExample);
    console.log('Configuration file has been created. Provide your Discord Token and restart.');
    process.exit(1);
}

CmdHandler.cmdPrefix = cfg.prefix;
CmdHandler.loadCmdList();
EventHandler.loadEvents();

const pride: PrideClient = new PrideClient(cfg.token);

EventHandler.initEvents(pride);
