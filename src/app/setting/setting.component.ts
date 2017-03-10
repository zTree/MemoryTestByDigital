import { Component, OnInit, animate, style, state, transition, trigger } from '@angular/core';

@Component({
    // moduleId: module.id,
    selector: 'game-setting',
    templateUrl: 'setting.component.html',
    animations: [
        trigger('settingState', [
            state('inactive', style({
                opacity: 0,
                transform: 'scale(0)'
            })),
            state('active',   style({
                opacity: 1,
                transform: 'scale(1)'
            })),
            transition('inactive => active', animate('300ms ease-in')),
            transition('active => inactive', animate('300ms ease-out'))
        ])
    ],
})
export class SettingComponent implements OnInit {
    public count: number;
    public settingState = 'inactive';

    constructor() {
        this.count = 8;
    }

    public ngOnInit(): void {
        setTimeout(() => {
            this.settingState = 'active';
        }, 300);
    }

    public init(): void {
        this.settingState = 'inactive';
    }
}
