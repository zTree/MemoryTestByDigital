import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    // moduleId: module.id,
    selector: 'game-platform',
    templateUrl: 'platform.component.html',
})
export class PlatformComponent implements OnInit, OnChanges {
    public count: number;

    constructor() {
        this.count = 8;
    }

    public ngOnInit(): void {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['count'].currentValue) {
            console.log('platform change count: ' + this.count);
        }
    }

    public changeCount(count: number): void {
        console.log('platform -- ' + count + ' === ' + this.count);
        if (count === this.count) {
            return;
        }

        count = Math.floor(count);
        if (isNaN(count)) {
            count = this.count;
        }

        if (count < 1) {
            count = 1;
        } else if (count > 999) {
            count = 999;
        }

        this.count = count;
    }

    public init(): void {
    }
}
