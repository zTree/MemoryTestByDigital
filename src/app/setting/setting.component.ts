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
export class SettingComponent implements OnInit, OnChanges {
    @Output() public onSetCount = new EventEmitter();
    @Output() public onSetHardLevel = new EventEmitter();
    @Output() public onSetGameActive = new EventEmitter();
    @Input() public count: number;
    @Input() public hardLevel: number;
    public settingState = 'inactive';
    public disabledBtn = {};
    public keyboardType: string;
    private _countInput: number;

    public inputCount(value: number) {
        if (value < 0 && this.count === 0) {
            return;
        }

        if (value < 0) {
            // 删除键
            this._countInput = Math.floor(this.count / 10);
            // } else if (this.count > 99) {
            //     this._countInput = (this.count % 100) * 10 + value;
        } else if (value === 99) {
            // 开始 Game
            this.settingState = 'inactive';
            setTimeout(() => {
                this.onSetGameActive.emit(true);
            }, 300);
            return;
        } else {
            this._countInput = this.count * 10 + value;
        }

        this.onSetCount.emit(this._countInput);
    }

    // constructor() {
    //
    // }

    public ngOnInit(): void {
        this.keyboardType = 'setting';
        setTimeout(() => {
            this.settingState = 'active';
        }, 300);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['count']) {
            // console.log('platform change count: ' + this.count);
            if (this.count === 0) {
                this.disabledBtn = {
                    value: 99,
                    disabled: true
                };
            } else {
                this.disabledBtn = {
                    value: 99,
                    disabled: false
                };
            }
        }
    }

    public init(): void {
        this.settingState = 'inactive';
    }
}
