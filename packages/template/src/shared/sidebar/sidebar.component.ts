import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavigationItem } from '../../interfaces/public-api';
import { GlobalContext } from '../../services/global-context';

@Component({
    selector: 'dg-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    @HostBinding(`class.dg-sidebar`) isSidebar = true;

    @Input() menus: NavigationItem[];
    menuDisplayMap = new Map<NavigationItem, boolean>();
    readonly initDisplay = true;
    constructor(public global: GlobalContext, private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.router.events.pipe(filter(item => item instanceof NavigationEnd)).subscribe(() => {
            this.openToRouter();
        });
    }

    toggle(menu: NavigationItem) {
        if (!menu.items || !menu.items.length) {
            return;
        }
        let status = this.menuDisplayMap.get(menu);
        this.setMenuOpen(menu, !status);
    }

    private setMenuOpen(menu: NavigationItem, open: boolean) {
        this.menuDisplayMap.set(menu, open);
    }

    ngOnChanges(): void {
        if (this.initDisplay) {
            this.setMenuDisplay(this.menus);
        }
        this.openToRouter();
    }

    private openToRouter() {
        this.findRouter(this.menus).forEach(menu => {
            this.setMenuOpen(menu, true);
        });
    }

    private findRouter(menus: NavigationItem[]): NavigationItem[] {
        for (const menu of menus) {
            let urlTree = this.router.createUrlTree(['./' + menu.path], { relativeTo: this.activatedRoute });
            let result = this.router.isActive(urlTree, !menu.examples);
            if (result) {
                return [menu];
            }
            if (menu.items && menu.items.length) {
                let result = this.findRouter(menu.items);
                if (result && result.length) {
                    return [menu, ...result];
                }
            }
        }
        return [];
    }

    private setMenuDisplay(menus: NavigationItem[]) {
        for (const menu of menus) {
            this.menuDisplayMap.set(menu, true);
            if (menu.items && menu.items.length) {
                this.setMenuDisplay(menu.items);
            }
        }
    }
}
