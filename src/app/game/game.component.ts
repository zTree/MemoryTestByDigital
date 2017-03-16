import {
    Component, ViewChild, ElementRef,
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
    @Input() public hardLevel: number;
    @Input() public mediaState: number;
    @Input() public gameActive: boolean;
    @ViewChild('questionPoolBody') public questionPoolBodyElement: ElementRef;
    public gameMainState = 'inactive';
    public GameState = {
        BACKGROUND: 'background',
        READY: 'ready',
        SHOWING: 'showing',
        WAITING: 'waiting',
        END: 'end'
    };
    public GameInfo = [
        {
            score: 100,
            infoList: ['恭喜你！完全正确！', '你太厉害了！', '你简直是无极限呀！']
        },
        {
            score: 80,
            infoList: ['精益求精需要不断练习', '就差一点儿...', '马虎了吧？', '有人在影响你么？']
        },
        {
            score: 60,
            infoList: ['刚及格...你要小心了', '这就到达你的上限了？...', '把电视关掉，不要分散注意力']
        },
        {
            score: 0,
            infoList: ['亲，你的脑神经已经紊乱...', '洗洗睡吧，你可能不适合这个', '累了就歇会儿，明天再来吧！']
        }
    ];

    // gameState: ready, showing, waiting, end
    public gameState: string;
    public isbandon: boolean;
    public questionPool: any[];
    public curNumberActive: boolean;
    public curNumber: number;
    public curInputIndex: number;
    public keyboardType: string;
    public score: number;
    public scoreTxt: string;
    private showNumberTimer = [[1500, 2500], [500, 1500], [300, 1000]];
    private numAudioArea = [0, 8.724, 7.794, 6.912, 5.928, 4.854, 3.630, 2.762, 1.902, 1];

    constructor(private cookie: CookieUtils) {
        this.gameState = this.GameState.BACKGROUND;
        this.isbandon = false;
        this.curNumberActive = false;
        this.curNumber = -1;
        this.score = 0;
        this.scoreTxt = '';
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
        if (this.gameState === this.GameState.WAITING &&
            index !== this.curInputIndex) {
            // 输入状态
            let lastInput = this.questionPool[this.curInputIndex];
            if (lastInput) {
                lastInput.active = false;
            }
            this.questionPool[index].active = true;
            this.curInputIndex = index;

            setTimeout(() => {
                let btn = this.questionPoolBodyElement.nativeElement.querySelector('.btn-info');
                if (btn) {
                    btn.focus();
                }
            }, 100);
            return;
        }

        if (this.gameState === this.GameState.END) {
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

    public abandonGame() {
        this.scoreTxt = '半途而废了....';
        this.isbandon = true;
        this.gameState = this.GameState.END;
        if (this.mediaState === 1) {
            let audio = document.body.querySelector('audio');
            audio.pause();
        }
    }

    public goSetting() {
        this.onSetGameActive.emit(false);
    }

    public init(): void {
        this.gameMainState = 'inactive';
    }

    private readyGame(): void {
        this.cookie.put('memory-last-count',
            this.count.toString(), this.cookie.getOptions(365));
        this.cookie.put('memory-last-hard-level',
            this.hardLevel.toString(), this.cookie.getOptions(365));
        this.gameMainState = 'active';
        this.gameState = this.GameState.READY;
        this.isbandon = false;
        this.keyboardType = 'game';
        this.questionPool = [];
        this.curInputIndex = -1;
        setTimeout(() => {
            this.gameState = this.GameState.SHOWING;
        }, 3000);
        setTimeout(() => {
            this.startGame();
        }, 4000);
    }

    private startGame(): void {
        this.createNext();
    }

    private stopGame(): void {
        this.gameState = this.GameState.BACKGROUND;
    }

    private createNext(): void {
        if (this.gameState !== this.GameState.SHOWING) {
            return;
        }
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
        this.playNumAudio(this.curNumber);
        // console.log(this.questionPool);
        setTimeout(() => {
            this.curNumberActive = false;
        }, this.showNumberTimer[this.hardLevel - 1][0]);
        setTimeout(() => {
            this.createNext();
        }, this.showNumberTimer[this.hardLevel - 1][1]);
    }

    private waitAnswer(): void {
        this.gameState = this.GameState.WAITING;
        this.setCurIndex(0);

    }

    private submitAnswer(): void {
        this.gameState = this.GameState.END;
        this.questionPool[this.curInputIndex].active = false;

        let rightCount = 0;
        for (let question of this.questionPool) {
            question.right = (question.value === question.answer);
            if (question.right) {
                rightCount++;
            }
        }
        this.score = Math.floor(rightCount * 100 / this.questionPool.length);
        this.setScoreText();
    }

    private getNextNumber(): number {
        let arr = Array.from(Math.floor(Math.random() * new Date().valueOf()).toString());
        return parseInt(arr[arr.length - 2], 10);
    }

    private playNumAudio(index) {
        if (this.mediaState !== 1) {
            return;
        }
        let audio = document.body.querySelector('audio');
        audio.currentTime = this.numAudioArea[index];
        audio.play();

        setTimeout(() => {
            audio.pause();
        }, 800);
    }

    private setScoreText(): void {
        let random = Math.floor(Math.random() * new Date().valueOf());
        for (let scoreLevel of this.GameInfo) {
            if (this.score >= scoreLevel.score) {
                this.scoreTxt = scoreLevel.infoList[random % scoreLevel.infoList.length];
                break;
            }
        }
    }
}
