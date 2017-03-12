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
    @Input() public keyboardType: string;
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
            {value: -111, text: '上一个', icon:'arrow-left', style: 'btn-default'},
            {value: 99, text: '开始', style: 'btn-primary'},
            {value: 0, text: '0'},
            {value: -1, text: '删除', style: 'btn-warning'},
            {value: 111, text: '下一个', icon:'arrow-right', style: 'btn-default'},
        ],
        [
            {value: 9999, text: '完成', style: 'btn-primary'}
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
    // 上一个：-111
    // 下一个：111
    // 其它：0-9
    public inputCount(btn: any) {
        if (btn.disabled || btn.isSpace) {
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
        if (changes['disabledBtn']) {
            let btn = changes['disabledBtn'].currentValue;
            if (this.keyMap[btn.value]) {
                this.keyMap[btn.value].disabled = !!btn.disabled;
                this.keyMap[btn.value].hidden = !!btn.hidden;
            }
        }
        if (changes['keyboardType']) {
            let type = changes['keyboardType'].currentValue;
            if (type === 'setting') {
                this.keyMap[-111].hidden = true;
                this.keyMap[111].hidden = true;
                this.keyMap[9999].hidden = true;
            } else if (type === 'game') {
                this.keyMap[99].hidden = true;
                this.keyMap[-1].hidden = true;
            }
        }
    }
}
