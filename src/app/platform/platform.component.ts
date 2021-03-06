import { Component, OnInit } from '@angular/core';

import { CookieUtils }     from '../utils/cookieUtils';

@Component({
    // moduleId: module.id,
    selector: 'game-platform',
    templateUrl: 'platform.component.html',
})
export class PlatformComponent implements OnInit {
    public count: number;
    public hardLevel: number;
    public mediaState: number;
    public gameActive: boolean;

    constructor(private cookie: CookieUtils) {

    }

    public ngOnInit(): void {
        this.count = parseInt(this.cookie.get('memory-last-count'), 10) || 6;
        this.hardLevel = parseInt(this.cookie.get('memory-last-hard-level'), 10) || 2;
        this.mediaState = parseInt(this.cookie.get('memory-last-media-state'), 10) || 0;
        this.gameActive = false;
    }

    public changeCount(count: number): void {
        // console.log('platform -- ' + this.count + ' => ' + count);
        if (count === this.count) {
            return;
        }

        count = Math.floor(count);
        if (isNaN(count)) {
            count = this.count;
        }

        if (count < 0 || count > 999) {
            return;
        }

        this.count = count;
    }

    public changeHardLevel(hardLevel: number): void {
        if (hardLevel === this.hardLevel) {
            return;
        }

        this.hardLevel = hardLevel;
    }
    public changeMediaState(mediaState: number): void {
        if (mediaState === this.mediaState) {
            return;
        }

        this.mediaState = mediaState;
    }

    public setGameActive(active) {
        this.gameActive = !!active;
    }

    // public init(): void {
    // }
}
