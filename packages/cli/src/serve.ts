import { CommandModule } from 'yargs';
import { Docgeni, DocgeniConfig, DEFAULT_CONFIG } from '@docgeni/core';
import { normalizeCommandArgsForAngular } from './angular-args';
import { getConfiguration } from './configuration';

export const serveCommand: CommandModule = {
    command: ['serve'],
    describe: 'Serve documentation site for development',
    builder: yargs => {
        yargs
            .option('docs-folder', {
                desc: `Docs folder path`,
                default: DEFAULT_CONFIG.docsPath
            })
            .option('siteProjectName', {
                desc: `Site project name`,
                default: ''
            })
            .config(getConfiguration());

        return yargs;
    },
    handler: async (argv: any) => {
        const config = argv as DocgeniConfig;

        const docgeni = new Docgeni({
            watch: true,
            config,
            cmdArgs: normalizeCommandArgsForAngular(config)
        });
        docgeni.run();
    }
};
