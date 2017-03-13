import {
    Component,
    OnChanges, SimpleChanges, Input, Output, EventEmitter,
    animate, style, state, transition, trigger
} from '@angular/core';

import { CookieUtils }     from '../utils/cookieUtils';

@Component({
    // moduleId: module.id,
    selector: 'game-main',
    templateUrl: 'game.component.html',
    animations: [
        trigger('gameMainState', [
            state('inactive', style({
                width: 0,
                height: 0,
                overflow: 'hidden',
                opacity: 0
            })),
            state('active', style({
                width: 'auto',
                height: 'auto',
                overflow: 'visible',
                opacity: 1
            })),
            transition('inactive => active', animate('300ms ease-in')),
            transition('active => inactive', animate('300ms ease-out'))
        ]),
    ],
})
export class GameComponent implements OnChanges {
    @Output() public onSetCount = new EventEmitter();
    @Output() public onSetGameActive = new EventEmitter();
    @Input() public count: number;
    @Input() public gameActive: boolean;
    public gameMainState = 'inactive';
    public GAMESTATE = {
        BACKGROUND: 'background',
        READY: 'ready',
        SHOWING: 'showing',
        WAITING: 'waiting',
        END: 'end'
    };
    // gameState: ready, showing, waiting, end
    public gameState: string;
    public questionPool: any[];
    public curNumberActive: boolean;
    public curNumber: number;
    public curInputIndex: number;
    public keyboardType: string;
    public score: number;

    constructor(private cookie: CookieUtils) {
        this.gameState = this.GAMESTATE.BACKGROUND;
        this.curNumberActive = false;
        this.curNumber = -1;
        this.score = 0;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['gameActive']) {
            if (this.gameActive) {
                this.readyGame();
            } else {
                this.stopGame();
            }
        }
    }

    public inputCount(value: number) {
        let index = this.curInputIndex;
        let question;

        if (value === 9999) {
            this.submitAnswer();
            return;
        }

        if (value === -111 && index > 0) {
            this.setCurIndex(index - 1);
        } else if (value === 111 && index < this.questionPool.length - 1) {
            this.setCurIndex(index + 1);

        } else if (value >= 0 && value <= 9) {
            question = this.questionPool[index];
            question.answer = value;

            if (index < this.questionPool.length - 1 &&
                this.questionPool[index + 1].answer === '') {
                this.setCurIndex(index + 1);
            }
        }
    }

    public setCurIndex(index: number) {
        if (this.gameState === this.GAMESTATE.WAITING &&
            index !== this.curInputIndex) {
            // 输入状态
            let lastInput = this.questionPool[this.curInputIndex];
            if (lastInput) {
                lastInput.active = false;
            }
            this.questionPool[index].active = true;
            this.curInputIndex = index;
            return;
        }

        if (this.gameState === this.GAMESTATE.END) {
            // 错题的正确答案显示
            let question = this.questionPool[index];
            if (!question.right && question.answer !== question.value) {
                let answer = question.answer;
                question.answer = question.value;
                setTimeout(() => {
                    question.answer = answer;
                }, 1000);
            }
        }
    }

    public setCount(addCount) {
        this.onSetCount.emit(this.count + parseInt(addCount, 10));
        setTimeout(() => {
            this.readyGame();
        }, 1000);
    }

    public goSetting() {
        this.onSetGameActive.emit(false);
    }

    public init(): void {
        this.gameMainState = 'inactive';
    }

    private readyGame(): void {
        this.cookie.put('memory-last-count', this.count.toString(), this.cookie.getOptions(365));
        this.gameMainState = 'active';
        this.gameState = this.GAMESTATE.READY;
        this.keyboardType = 'game';
        this.questionPool = [];
        this.curInputIndex = -1;
        setTimeout(() => {
            this.gameState = this.GAMESTATE.SHOWING;
        }, 3000);
        setTimeout(() => {
            this.startGame();
        }, 4000);
    }

    private startGame(): void {
        this.createNext();
    }

    private stopGame(): void {
        this.gameState = this.GAMESTATE.BACKGROUND;
    }

    private createNext(): void {
        if (this.questionPool.length >= this.count) {
            this.waitAnswer();
            return;
        }
        this.curNumber = this.getNextNumber();
        this.curNumberActive = true;
        this.questionPool.push({
            value: this.curNumber,
            answer: '',
            active: false,
            right: null
        });
        // console.log(this.questionPool);
        setTimeout(() => {
            this.curNumberActive = false;
        }, 500);
        setTimeout(() => {
            this.createNext();
        }, 1500);
    }

    private waitAnswer(): void {
        this.gameState = this.GAMESTATE.WAITING;
        this.setCurIndex(0);

    }

    private submitAnswer(): void {
        this.gameState = this.GAMESTATE.END;
        this.questionPool[this.curInputIndex].active = false;

        let rightCount = 0;
        for (let question of this.questionPool) {
            question.right = (question.value === question.answer);
            if (question.right) {
                rightCount++;
            }
        }
        this.score = Math.floor(rightCount * 100 / this.questionPool.length);
    }

    private getNextNumber(): number {
        return parseInt(Array.from((Math.random() * new Date().valueOf()).toString()).pop(), 10);
    }
}
