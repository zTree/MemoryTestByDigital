import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    // moduleId: module.id,
    selector: 'game-platform',
    templateUrl: 'platform.component.html',
})
export class PlatformComponent implements OnInit, OnChanges {
    public count: number;

    // constructor() {
    // }

    public ngOnInit(): void {
        this.count = 8;
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

        if (count < 0 || count > 999) {
            return;
        }

        this.count = count;
    }

    // public init(): void {
    // }
}
