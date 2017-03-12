import {
    Component, OnInit,
    OnChanges, SimpleChanges, Input, Output, EventEmitter,
    animate, style, state, transition, trigger
} from '@angular/core';

@Component({
    // moduleId: module.id,
    selector: 'game-keyboard',
    templateUrl: 'keyboard.component.html',
    // animations: [
    //     trigger('settingState', [
    //         state('inactive', style({
    //             opacity: 0,
    //             transform: 'scale(0)'
    //         })),
    //         state('active', style({
    //             opacity: 1,
    //             transform: 'scale(1)'
    //         })),
    //         transition('inactive => active', animate('300ms ease-in')),
    //         transition('active => inactive', animate('300ms ease-out'))
    //     ])
    // ],
})
export class KeyboardComponent implements OnInit, OnChanges {
    @Output() public onKeyDown = new EventEmitter();
    @Input() public disabledBtn: any;
    // public settingState = 'inactive';
    public keyList = [
        [
            {value: 1, text: '1'},
            {value: 2, text: '2'},
            {value: 3, text: '3'}
        ],
        [
            {value: 4, text: '4'},
            {value: 5, text: '5'},
            {value: 6, text: '6'}
        ],
        [
            {value: 7, text: '7'},
            {value: 8, text: '8'},
            {value: 9, text: '9'}
        ],
        [
            {value: 99, text: '开始', style: 'btn-primary'},
            {value: 9999, text: '完成', style: 'btn-primary', hidden: true},
            {value: 0, text: '0'},
            {value: -1, text: '删除', style: 'btn-warning'}
        ]
    ];
    private keyMap = {};

    constructor() {
        for (let row of this.keyList) {
            for (let btn of row) {
                this.keyMap[btn.value] = btn;
            }
        }
    }

    // 开始：99
    // 删除：-1
    // 完毕：9999
    // 其它：0-9
    public inputCount(btn: any) {
        if (btn.disabled) {
            return;
        }
        this.onKeyDown.emit(btn.value);
    }

    public ngOnInit(): void {
        // setTimeout(() => {
        //     this.settingState = 'active';
        // }, 300);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['disabledBtn'].currentValue) {
            let btn = changes['disabledBtn'].currentValue;
            if (this.keyMap[btn.value]) {
                this.keyMap[btn.value].disabled = btn.disabled;
            }
        }
    }
}
