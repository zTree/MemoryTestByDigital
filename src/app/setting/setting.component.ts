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
    @Input() public count: number;
    private _countInput: number;

    public inputCount(value: number) {
        if (value < 0 && this.count === 0) {
            return;
        }

        if (value < 0) {
            this._countInput = Math.floor(this.count / 10);
        // } else if (this.count > 99) {
        //     this._countInput = (this.count % 100) * 10 + value;
        } else {
            this._countInput = this.count * 10 + value;
        }

        this.onSetCount.emit(this._countInput);
    }

    // constructor() {
    //
    // }

    public ngOnInit(): void {
        setTimeout(() => {
            this.settingState = 'active';
        }, 300);
    }

    public init(): void {
        this.settingState = 'inactive';
    }
}
