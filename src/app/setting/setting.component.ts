import {
    Component, OnInit,
    OnChanges, SimpleChanges, Input, Output, EventEmitter,
    animate, style, state, transition, trigger
} from '@angular/core';

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
            state('active', style({
                opacity: 1,
                transform: 'scale(1)'
            })),
            transition('inactive => active', animate('300ms ease-in')),
            transition('active => inactive', animate('300ms ease-out'))
        ])
    ],
})
export class SettingComponent implements OnInit {
    @Output() public onSetCount = new EventEmitter();
    public settingState = 'inactive';
    private _count: number;

    get count(): number {
        return this._count;
    }
    @Input('count')
    set count(value: number) {
        console.log('set count 1: ' + value + '====' + this._count);

        // 当超出边界后，修正边界值，必须要修改当前值，否则无法修改 input 内的数据
        if (value === this._count) {
            return;
        }
        this._count = value;
        this.onSetCount.emit(this.count);
        console.log('set count 2: ' + value);
    }

    constructor() {

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
