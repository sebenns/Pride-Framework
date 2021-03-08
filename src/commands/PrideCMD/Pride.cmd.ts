import {Command} from '../../interfaces/Command';
import {Token} from '../../utils/Tokenizer';
import {PrideHandler} from "./PrideHandler";
import {CmdHandler} from "../../core/CmdHandler";
import {Message} from 'discord.js';
import {PermHandler} from "../../core/PermHandler";

export class PrideCmd implements Command
{
    public command = [
        'pride',
        'prideBot'
    ];

    public arguments = [
        `\\breload(\\s(cmds|command(s)?|cmd|event(s)?))?`,
        `\\b(disable|dis)(\\s\\w+)`,
        `\\b(enable|en)(\\s\\w+)`,
        `\\b(avatar|ava)\\shttp(s)?:\\/\\/[\\w.\\/]+`,
        `\\b(username|uname)\\s.+`,
        `\\bprefix\\s[^\\s]+`,
        `\\bowner\\s<@![0-9]+>`
    ];

    public usage = [
        `${CmdHandler.cmdPrefix}pride reload cmd(s)|event(s)`,
        `${CmdHandler.cmdPrefix}pride disable/dis <command>`,
        `${CmdHandler.cmdPrefix}pride enable/en <command>`,
        `${CmdHandler.cmdPrefix}pride avatar <url>`,
        `${CmdHandler.cmdPrefix}pride username <new username here>`,
        `${CmdHandler.cmdPrefix}pride prefix <new prefix here>`,
        `${CmdHandler.cmdPrefix}pride owner`
    ];

    public description = 'Make basic settings with the Pride command. De/activate commands, change username, avatar and prefix, transfer ownership.';

    public switchable = false;

    permissions(msg: Message): boolean
    {
        return PermHandler.isPrideOwner(msg) || PermHandler.isOwner(msg);
    }

    execute(msg: Message, tokens: Token[]): void
    {
        // Filter through tokens and execute action for specified token
        if (tokens && tokens.length > 0)
        {
            const handler = [
                {
                    token : ['reload'],
                    action: (token, msg): void => PrideHandler.reload(token, msg)
                },
                {
                    token : ['disable', 'dis'],
                    action: (token, msg): void => PrideHandler.disable(token, msg)
                },
                {
                    token : ['enable', 'en'],
                    action: (token, msg): void => PrideHandler.enable(token, msg)
                },
                {
                    token : ['avatar', 'ava'],
                    action: (token, msg): void => PrideHandler.changeAvatar(token, msg)
                },
                {
                    token : ['username', 'uname'],
                    action: (token, msg): void => PrideHandler.changeUserName(token, msg)
                },
                {
                    token : ['prefix'],
                    action: (token, msg): void => PrideHandler.changePrefix(token, msg)
                },
                {
                    token : ['owner'],
                    action: (token, msg): void => PrideHandler.changeOwner(token, msg)
                }
            ];

            for (const argument of tokens)
            {
                const currHandler = handler.find(handler =>
                    handler.token.find(token =>
                        argument.token.startsWith(token)));

                if (currHandler)
                {
                    if (argument.token.indexOf(' ') < 0) argument.token = '';
                    return currHandler.action(argument.token.substr(argument.token.indexOf(' ') + 1), msg);
                }
            }
        }

        return PrideHandler.help(this.usage, msg);
    }
}