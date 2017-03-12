import {
    Component, OnInit,
    OnChanges, SimpleChanges, Input, Output, EventEmitter,
    animate, style, state, transition, trigger
} from '@angular/core';

@Component({
    // moduleId: module.id,
    selector: 'game-main',
    templateUrl: 'game.component.html',
    animations: [
        trigger('gameState', [
            state('inactive', style({
                opacity: 0
            })),
            state('active', style({
                opacity: 1
            })),
            transition('inactive => active', animate('300ms ease-in')),
            transition('active => inactive', animate('300ms ease-out'))
        ])
    ],
})
export class GameComponent implements OnInit, OnChanges {
    @Output() public onSetCount = new EventEmitter();
    @Output() public onSetGameActive = new EventEmitter();
    @Input() public count: number;
    @Input() public gameActive: boolean;
    public gameState = 'inactive';
    public isProcessActive = false;
    public isReady = false;
    public questionPool: number[];
    public answerPool: number[];

    constructor() {

    }

    public ngOnInit(): void {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        console.log(JSON.stringify(changes));
        if (changes['gameActive']) {
            if (this.gameActive) {
                this.gameState = 'active';
                this.isReady = true;
                setTimeout(() => {
                    this.isReady = false;
                    this.startGame();
                }, 3000);
            } else {
                this.stopGame();
            }
        }
    }

    public init(): void {
        this.gameState = 'inactive';
    }

    private startGame(): void {
        this.questionPool = [];
        this.createNext();

    }
    private stopGame(): void {

    }
    private createNext(): void {
        if (this.questionPool.length >= this.count) {
            this.waitAnswer();
            return;
        }
        this.questionPool.push(this.getNextNumber());
        console.log(this.questionPool);
        setTimeout(() => {
            this.createNext();
        }, 1500);
    }
    private waitAnswer(): void {

    }
    private submitAnswer(): void {

    }

    private getNextNumber(): number {
        return parseInt(Array.from((Math.random() * new Date().valueOf()).toString()).pop(), 10);
    }
}
