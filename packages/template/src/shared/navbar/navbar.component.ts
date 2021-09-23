import { Component, OnInit, HostBinding, ElementRef, AfterViewInit } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services/public-api';
import { ChannelItem } from '../../interfaces/public-api';
import docsearch from 'docsearch.js';

@Component({
    selector: 'dg-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, AfterViewInit {
    @HostBinding('class.dg-navbar') isNavbar = true;

    @HostBinding('class.show') showNav = false;

    channels: ChannelItem[];

    constructor(public global: GlobalContext, public navigationService: NavigationService, private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit(): void {
        this.channels = this.navigationService.getChannels();
        this.elementRef.nativeElement.classList.add(this.global.config.theme);
    }

    ngAfterViewInit() {
        this.global.initAlgolia('#inputSearch');
    }

    toggleNavbar() {
        this.showNav = !this.showNav;
    }

    search() {}
}
