import { BetType, Bet } from '../../types';
import {
    RED_NUMBERS, BLACK_NUMBERS, COLUMNS, DOZENS,
    LOW_NUMBERS, HIGH_NUMBERS, ODD_NUMBERS, EVEN_NUMBERS
} from '../../constants/roulette';

export interface BettingArea {
    x: number;
    y: number;
    width: number;
    height: number;
    bet: Bet;
    label: string;
}

export class BettingZoneFactory {
    private cellWidth: number;
    private cellHeight: number;

    constructor(cellWidth: number, cellHeight: number) {
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
    }

    public generateAllZones(): BettingArea[] {
        const zones: BettingArea[] = [];

        // Base coordinates
        const startX = 5 + this.cellWidth + 5;
        const startY = 5;

        zones.push(...this.createZeroZone());
        zones.push(...this.createNumberZones(startX, startY));
        zones.push(...this.createDozenZones(startX, startY));
        zones.push(...this.createEvenMoneyZones(startX, startY));
        zones.push(...this.createColumnZones(startX));
        zones.push(...this.createSplitZones(startX, startY));
        zones.push(...this.createStreetZones(startX, startY));
        zones.push(...this.createCornerZones(startX, startY));
        zones.push(...this.createLineZones(startX, startY));

        return zones;
    }

    private createZeroZone(): BettingArea[] {
        return [{
            x: 5, y: 5, width: this.cellWidth, height: this.cellHeight * 3,
            bet: { type: 'straight', numbers: [0], amount: 0 }, label: '0'
        }];
    }

    private createNumberZones(startX: number, startY: number): BettingArea[] {
        const zones: BettingArea[] = [];
        for (let col = 0; col < 12; col++) {
            for (let row = 0; row < 3; row++) {
                const number = col * 3 + (3 - row);
                zones.push({
                    x: startX + col * this.cellWidth,
                    y: startY + row * this.cellHeight,
                    width: this.cellWidth, height: this.cellHeight,
                    bet: { type: 'straight', numbers: [number], amount: 0 },
                    label: number.toString()
                });
            }
        }
        return zones;
    }

    private createDozenZones(startX: number, startY: number): BettingArea[] {
        const zones: BettingArea[] = [];
        const dozenWidth = this.cellWidth * 4;
        const dozenY = startY + this.cellHeight * 3 + 10;

        [1, 2, 3].forEach((d, i) => {
            zones.push({
                x: startX + dozenWidth * i, y: dozenY, width: dozenWidth, height: 50,
                bet: { type: 'dozen', numbers: DOZENS[d as 1 | 2 | 3], amount: 0 },
                label: `${d === 1 ? '1st' : d === 2 ? '2nd' : '3rd'}12`
            });
        });
        return zones;
    }

    private createEvenMoneyZones(startX: number, startY: number): BettingArea[] {
        const zones: BettingArea[] = [];
        const y = startY + this.cellHeight * 3 + 10 + 50 + 5;
        const w = this.cellWidth * 2;
        const h = 50;

        const bets: { type: BetType; nums: number[]; label: string }[] = [
            { type: 'low', nums: LOW_NUMBERS, label: '1-18' },
            { type: 'even', nums: EVEN_NUMBERS, label: 'EVEN' },
            { type: 'red', nums: RED_NUMBERS, label: 'RED' },
            { type: 'black', nums: BLACK_NUMBERS, label: 'BLACK' },
            { type: 'odd', nums: ODD_NUMBERS, label: 'ODD' },
            { type: 'high', nums: HIGH_NUMBERS, label: '19-36' }
        ];

        bets.forEach((b, i) => {
            zones.push({
                x: startX + w * i, y, width: w, height: h,
                bet: { type: b.type, numbers: [...b.nums], amount: 0 },
                label: b.label
            });
        });
        return zones;
    }

    private createColumnZones(startX: number): BettingArea[] {
        const zones: BettingArea[] = [];
        const colX = startX + 12 * this.cellWidth + 5;

        [3, 2, 1].forEach((colNum, i) => {
            zones.push({
                x: colX, y: 5 + this.cellHeight * i, width: this.cellWidth, height: this.cellHeight,
                bet: { type: 'column', numbers: COLUMNS[colNum as 1 | 2 | 3], amount: 0 },
                label: `Col${colNum}`
            });
        });
        return zones;
    }

    private createSplitZones(startX: number, startY: number): BettingArea[] {
        const zones: BettingArea[] = [];

        // Horizontal splits (between vertically adjacent numbers)
        for (let col = 0; col < 12; col++) {
            for (let row = 0; row < 2; row++) {
                const topNum = col * 3 + (3 - row);
                const bottomNum = col * 3 + (3 - row - 1);
                zones.push({
                    x: startX + col * this.cellWidth + 5,
                    y: startY + (row + 1) * this.cellHeight - 5,
                    width: this.cellWidth - 10, height: 10,
                    bet: { type: 'split', numbers: [bottomNum, topNum].sort((a, b) => a - b), amount: 0 },
                    label: `Split ${bottomNum}/${topNum}`
                });
            }
        }

        // Vertical splits (between horizontally adjacent numbers)
        for (let col = 0; col < 11; col++) {
            for (let row = 0; row < 3; row++) {
                const leftNum = col * 3 + (3 - row);
                const rightNum = (col + 1) * 3 + (3 - row);
                zones.push({
                    x: startX + (col + 1) * this.cellWidth - 5,
                    y: startY + row * this.cellHeight + 5,
                    width: 10, height: this.cellHeight - 10,
                    bet: { type: 'split', numbers: [leftNum, rightNum].sort((a, b) => a - b), amount: 0 },
                    label: `Split ${leftNum}/${rightNum}`
                });
            }
        }

        // Zero splits
        const zeroX = 5;
        const zeroY = 5;
        const zeroWidth = this.cellWidth;

        // Split 0/3
        zones.push({
            x: zeroX + zeroWidth - 5, y: zeroY + 5, width: 10, height: this.cellHeight - 10,
            bet: { type: 'split', numbers: [0, 3], amount: 0 }, label: 'Split 0/3'
        });

        // Split 0/2
        zones.push({
            x: zeroX + zeroWidth - 5, y: zeroY + this.cellHeight + 5, width: 10, height: this.cellHeight - 10,
            bet: { type: 'split', numbers: [0, 2], amount: 0 }, label: 'Split 0/2'
        });

        // Split 0/1
        zones.push({
            x: zeroX + zeroWidth - 5, y: zeroY + this.cellHeight * 2 + 5, width: 10, height: this.cellHeight - 10,
            bet: { type: 'split', numbers: [0, 1], amount: 0 }, label: 'Split 0/1'
        });

        return zones;
    }

    private createStreetZones(startX: number, startY: number): BettingArea[] {
        const zones: BettingArea[] = [];

        // Trio 0-2-3 (Intersection of 0, 2, 3)
        zones.push({
            x: startX - 5,
            y: startY + this.cellHeight - 5,
            width: 10, height: 10,
            bet: { type: 'street', numbers: [0, 2, 3], amount: 0 },
            label: 'Trio 0-2-3'
        });

        // Trio 0-1-2 (Intersection of 0, 1, 2)
        zones.push({
            x: startX - 5,
            y: startY + this.cellHeight * 2 - 5,
            width: 10, height: 10,
            bet: { type: 'street', numbers: [0, 1, 2], amount: 0 },
            label: 'Trio 0-1-2'
        });

        for (let col = 0; col < 12; col++) {
            const num1 = col * 3 + 1;
            const num2 = col * 3 + 2;
            const num3 = col * 3 + 3;
            zones.push({
                x: startX + col * this.cellWidth - 5,
                y: startY + this.cellHeight * 3 - 5,
                width: this.cellWidth, height: 10,
                bet: { type: 'street', numbers: [num1, num2, num3], amount: 0 },
                label: `Street ${num1}-${num3}`
            });
        }
        return zones;
    }

    private createCornerZones(startX: number, startY: number): BettingArea[] {
        const zones: BettingArea[] = [];

        // First Four (0-1-2-3) - Placed at the corner of 0 and 3 (top of board)
        zones.push({
            x: startX - 5,
            y: startY - 5,
            width: 10, height: 10,
            bet: { type: 'corner', numbers: [0, 1, 2, 3], amount: 0 },
            label: 'First Four'
        });

        for (let col = 0; col < 11; col++) {
            for (let row = 0; row < 2; row++) {
                const topLeft = col * 3 + (3 - row);
                const topRight = (col + 1) * 3 + (3 - row);
                const bottomLeft = col * 3 + (3 - row - 1);
                const bottomRight = (col + 1) * 3 + (3 - row - 1);
                zones.push({
                    x: startX + (col + 1) * this.cellWidth - 5,
                    y: startY + (row + 1) * this.cellHeight - 5,
                    width: 10, height: 10,
                    bet: { type: 'corner', numbers: [bottomLeft, bottomRight, topLeft, topRight].sort((a, b) => a - b), amount: 0 },
                    label: 'Corner'
                });
            }
        }
        return zones;
    }

    private createLineZones(startX: number, startY: number): BettingArea[] {
        const zones: BettingArea[] = [];
        for (let col = 0; col < 11; col++) {
            const s1 = col * 3 + 1;
            const s2 = (col + 1) * 3 + 1;
            const numbers = [s1, s1 + 1, s1 + 2, s2, s2 + 1, s2 + 2];
            zones.push({
                x: startX + (col + 1) * this.cellWidth - 5,
                y: startY + this.cellHeight * 3 - 5,
                width: 10, height: 10,
                bet: { type: 'line', numbers: numbers.sort((a, b) => a - b), amount: 0 },
                label: `Line ${s1}-${s2 + 2}`
            });
        }
        return zones;
    }
}
