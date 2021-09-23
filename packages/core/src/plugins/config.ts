import { Plugin } from './plugin';
import { DocgeniContext } from '../docgeni.interface';
import { DocgeniSiteConfig } from '../interfaces';
import { resolve } from '../fs';
import { toolkit } from '@docgeni/toolkit';

const PLUGIN_NAME = 'SiteConfigPlugin';

export class ConfigPlugin implements Plugin {
    apply(docgeni: DocgeniContext): void {
        docgeni.hooks.compilation.tap(PLUGIN_NAME, compilation => {
            compilation.hooks.buildSucceed.tap(PLUGIN_NAME, () => {
                const siteConfig: DocgeniSiteConfig = {
                    title: docgeni.config.title,
                    description: docgeni.config.description,
                    mode: docgeni.config.mode,
                    theme: docgeni.config.theme,
                    baseHref: docgeni.config.baseHref,
                    locales: docgeni.config.locales,
                    defaultLocale: docgeni.config.defaultLocale,
                    logoUrl: docgeni.config.logoUrl,
                    repoUrl: docgeni.config.repoUrl,
                    footer: docgeni.config.footer,
                    algolia: docgeni.config.algolia
                };
                const outputConfigPath = resolve(docgeni.paths.absSiteContentPath, 'config.ts');
                const content = toolkit.template.compile('config.hbs', {
                    siteConfig: JSON.stringify(siteConfig, null, 4)
                });
                compilation.addEmitFiles(outputConfigPath, content);
            });
        });
    }
}

module.exports = ConfigPlugin;
