import { Component, OnInit, HostBinding, Input, AfterViewInit } from '@angular/core';
import { NavigationItem } from '../../interfaces/public-api';
import { GlobalContext } from '../../services/global-context';
import docsearch from 'docsearch.js';

@Component({
    selector: 'dg-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, AfterViewInit {
    @HostBinding(`class.dg-sidebar`) isSidebar = true;

    @Input() menus: NavigationItem[];

    showSearch: boolean;

    constructor(public global: GlobalContext) {}

    ngOnInit(): void {
        this.showSearch = this.global.config.mode === 'lite' && this.global.hasAlgolia;
    }

    ngAfterViewInit() {
        if (this.showSearch) {
            this.global.initAlgolia('#sidebarInputSearch');
        }
    }
}
