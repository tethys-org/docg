import { DocgeniLibrary } from './library';
import { Locale } from './locale';

export interface HeroAction {
    text: string;
    link: string;
    btnType?: string;
    btnShape?: 'round' | 'square';
}

export interface HomeDocMeta {
    title: string;
    hero: {
        title: string;
        description: string;
        banner: string;
        actions: HeroAction;
        backgroundColor?: string;
    };
    features: {
        icon: string;
        title: string;
        description: string;
    }[];
    footer: string;
    contentPath: string;
}

export type DocgeniMode = 'full' | 'lite';

export interface DocgeniNavItem {
    /** Title for nav item **/
    title: string;
    /** Route path for nav item **/
    path: string;
    /** Whether is external link **/
    isExternal?: boolean;
    /** Lib name for libs **/
    lib?: string;
    /** Locales **/
    locales?: {
        [key: string]: {
            title: string;
        };
    };
}

export interface DocgeniAlgoliaConfig {
    appId?: string;

    apiKey: string;

    indexName: string;
}

export interface DocgeniConfig {
    /** Title of documentation, e.g: Docgeni **/
    title?: string;
    /** Description of documentation **/
    description?: string;
    /** Mode of documentation, full mode contains nav, home page, lite mode only contains menu and doc viewers **/
    mode?: DocgeniMode;
    /** Theme, angular navbar style and default style **/
    theme?: 'default' | 'angular';
    /** Base href of documentation, default is / **/
    baseHref?: string;
    /** Logo url*/
    logoUrl?: string;
    /** Public dir, default is .docgeni/public **/
    publicDir?: string;
    /** Repo url*/
    repoUrl?: string;
    /** Docs dir, default is 'docs' **/
    docsDir?: string;
    /** Site default dir .docgeni/site **/
    siteDir?: string;
    /** Site default dir .docgeni/components **/
    componentsDir?: string;
    /** Site output dir, default is dist/docgeni-site **/
    outputDir?: string;
    /** Angular demo site name in angular.json **/
    siteProjectName?: string;
    /** Angular libraries **/
    libs?: DocgeniLibrary[];
    /** Navigations for menu and nav **/
    navs?: DocgeniNavItem[];
    /** Locales **/
    locales?: Locale[];
    /** Default locale **/
    defaultLocale?: string;
    /** footer content **/
    footer?: string;
    /** algolia config */
    algolia?: DocgeniAlgoliaConfig;
}

// For Angular Template
export interface DocgeniSiteConfig {
    /** Title of documentation, e.g: Docgeni **/
    title: string;
    /** Heading of documentation, e.g: Doc Generator, default is same as title **/
    heading?: string;
    /** Description of documentation **/
    description?: string;
    /** Mode of documentation, full mode contains nav, home page, lite mode only contains menu and doc viewers **/
    mode?: 'full' | 'lite';
    /** Theme, angular navbar style and default style **/
    theme?: 'default' | 'angular';
    /** Base href of documentation, default is / **/
    baseHref?: string;
    /** Heads of documentation*/
    heads?: [];
    /** Logo url*/
    logoUrl?: string;
    /** Repo url*/
    repoUrl?: string;
    /** Home meta **/
    homeMeta?: HomeDocMeta;
    /** Locales **/
    locales?: Locale[];
    /** Default locale **/
    defaultLocale?: string;
    /** footer content **/
    footer?: string;
    /** algolia config */
    algolia?: DocgeniAlgoliaConfig;
}
