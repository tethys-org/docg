import { Injectable, Inject, InjectionToken } from '@angular/core';
import { DocgeniSiteConfig, NavigationItem, DocgeniMode, HomeDocMeta } from '../interfaces/public-api';
import { HttpClient } from '@angular/common/http';
import docsearch from 'docsearch.js';
import { languageCompare } from '../utils/language-compare';
export const CONFIG_TOKEN = new InjectionToken('DOC_SITE_CONFIG');

export const DEFAULT_CONFIG: DocgeniSiteConfig = {
    title: 'Docgeni',
    description: ''
};

const DOCGENI_LOCALE_KEY = 'docgeni-locale';
const DOCGENI_MODE_KEY = 'docgeni-mode';

@Injectable({
    providedIn: 'root'
})
export class GlobalContext {
    locale: string;

    navs: NavigationItem[];

    docItems: NavigationItem[];
    homeMeta: HomeDocMeta;
    readonly owner: string;
    readonly repo: string;
    get isDefaultLocale() {
        return this.locale === this.config.defaultLocale;
    }

    get hasAlgolia() {
        return !!(this.config.algolia && this.config.algolia.apiKey && this.config.algolia.indexName);
    }

    constructor(@Inject(CONFIG_TOKEN) public config: DocgeniSiteConfig, private http: HttpClient) {
        this.locale = config.defaultLocale;
        const maybeLocale = window.localStorage.getItem(DOCGENI_LOCALE_KEY) || window.navigator.language || '';
        const cacheMode = window.localStorage.getItem(DOCGENI_MODE_KEY);
        if (maybeLocale) {
            const isSupport = (config.locales || []).findIndex(item => languageCompare(item.key, maybeLocale));

            if (isSupport !== -1) {
                this.locale = config.locales[isSupport].key;
            }
        }
        if (cacheMode && ['lite', 'full'].includes(cacheMode)) {
            config.mode = cacheMode as DocgeniMode;
        }
        document.body.classList.add(`dg-mode-${this.config.mode}`, `dg-theme-${this.config.theme}`);
        const pattern = /https:\/\/github.com\/([^\/]*)\/([^\/]*)/.exec(this.config.repoUrl);
        if (pattern && pattern.length === 3) {
            this.owner = pattern[1];
            this.repo = pattern[2];
        }
    }

    setLocale(locale: string) {
        this.locale = locale;
        window.localStorage.setItem(DOCGENI_LOCALE_KEY, locale);
    }

    getNowTimestamp() {
        return new Date().getTime();
    }

    initialize() {
        return new Promise((resolve, reject) => {
            this.http.get(`assets/content/navigations-${this.locale}.json?t=${this.getNowTimestamp()}`).subscribe({
                next: (response: { navs: NavigationItem[]; docs: NavigationItem[]; homeMeta: HomeDocMeta }) => {
                    this.homeMeta = response.homeMeta;
                    this.navs = response.navs;
                    this.docItems = this.flatNavs(this.navs);
                    resolve(response);
                },
                error: error => {
                    reject(error);
                }
            });
        });
    }

    getAssetsContentPath(path: string) {
        return path.startsWith('/') ? `assets/content${path}` : `assets/content/${path}`;
    }

    flatNavs(navs: NavigationItem[]) {
        navs = navs.slice();
        const list = [];
        while (navs.length) {
            const item = navs.shift();
            if (item.items) {
                navs.unshift(...item.items);
            } else if (!item.hidden) {
                list.push(item);
            }
        }
        return list;
    }

    initAlgolia(searchSelector: string) {
        if (this.hasAlgolia) {
            const algolia = this.config.algolia.appId
                ? {
                      appId: this.config.algolia.appId,
                      apiKey: this.config.algolia.apiKey,
                      indexName: this.config.algolia.indexName
                  }
                : {
                      apiKey: this.config.algolia.apiKey,
                      indexName: this.config.algolia.indexName
                  };

            docsearch({
                ...algolia,
                inputSelector: searchSelector
                // debug: true
            });
        }
    }
}
