import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    // moduleId: module.id,
    selector: 'game-platform',
    templateUrl: 'platform.component.html',
})
export class PlatformComponent implements OnInit {
    public count: number;
    public gameActive: boolean;

    // constructor() {
    // }

    public ngOnInit(): void {
        this.count = 8;
        this.gameActive = false;
    }

    public changeCount(count: number): void {
        console.log('platform -- ' + this.count + ' => ' + count);
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

    public setGameActive(active) {
        this.gameActive = !!active;
    }

    // public init(): void {
    // }
}
