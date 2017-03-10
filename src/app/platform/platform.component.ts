import { Component, OnInit } from '@angular/core';

@Component({
    // moduleId: module.id,
    selector: 'game-platform',
    templateUrl: 'platform.component.html',
})
export class PlatformComponent implements OnInit {
    public count: number;

    constructor() {
        this.count = 8;
    }

    public ngOnInit(): void {
    }

    public init(): void {
    }
}
