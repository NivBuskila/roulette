import { describe, it, expect } from 'vitest';
import { BettingZoneFactory } from './BettingZoneFactory';

describe('BettingZoneFactory', () => {
    const CELL_WIDTH = 60;
    const CELL_HEIGHT = 80;
    const factory = new BettingZoneFactory(CELL_WIDTH, CELL_HEIGHT);
    const zones = factory.generateAllZones();

    it('should generate the correct total number of betting zones', () => {
        // 1 (Zero) + 36 (Numbers) + 3 (Dozens) + 6 (Even Money) + 3 (Columns)
        // + 24 (Horizontal Splits) + 33 (Vertical Splits) + 3 (Zero Splits)
        // + 12 (Streets) + 2 (Trios) + 22 (Corners) + 1 (First Four) + 11 (Lines)
        // Total = 1 + 36 + 3 + 6 + 3 + 24 + 33 + 3 + 12 + 2 + 22 + 1 + 11 = 157
        expect(zones.length).toBe(157);
    });

    it('should generate Special Zero zones correctly', () => {
        const trio012 = zones.find(z => z.label === 'Trio 0-1-2');
        expect(trio012).toBeDefined();
        expect(trio012?.bet.type).toBe('street');
        expect(trio012?.bet.numbers).toEqual([0, 1, 2]);

        const trio023 = zones.find(z => z.label === 'Trio 0-2-3');
        expect(trio023).toBeDefined();
        expect(trio023?.bet.type).toBe('street');
        expect(trio023?.bet.numbers).toEqual([0, 2, 3]);

        const firstFour = zones.find(z => z.label === 'First Four');
        expect(firstFour).toBeDefined();
        expect(firstFour?.bet.type).toBe('corner');
        expect(firstFour?.bet.numbers).toEqual([0, 1, 2, 3]);
    });

    it('should generate the Zero zone correctly', () => {
        const zeroZone = zones.find(z => z.label === '0');
        expect(zeroZone).toBeDefined();
        expect(zeroZone?.bet.type).toBe('straight');
        expect(zeroZone?.bet.numbers).toEqual([0]);
        expect(zeroZone?.x).toBe(5);
        expect(zeroZone?.y).toBe(5);
        expect(zeroZone?.width).toBe(CELL_WIDTH);
        expect(zeroZone?.height).toBe(CELL_HEIGHT * 3);
    });

    it('should generate Number zones correctly (e.g., 17)', () => {
        const zone17 = zones.find(z => z.label === '17');
        expect(zone17).toBeDefined();
        expect(zone17?.bet.type).toBe('straight');
        expect(zone17?.bet.numbers).toEqual([17]);
    });

    it('should generate Dozen zones correctly', () => {
        const dozens = zones.filter(z => z.bet.type === 'dozen');
        expect(dozens.length).toBe(3);
        expect(dozens[0].label).toBe('1st12');
        expect(dozens[1].label).toBe('2nd12');
        expect(dozens[2].label).toBe('3rd12');
    });

    it('should generate Even Money zones correctly', () => {
        const redZone = zones.find(z => z.label === 'RED');
        expect(redZone).toBeDefined();
        expect(redZone?.bet.type).toBe('red');
        expect(redZone?.bet.numbers.length).toBe(18);
    });

    it('should generate Split zones correctly', () => {
        const splits = zones.filter(z => z.bet.type === 'split');
        // 24 horizontal + 33 vertical + 3 zero splits = 60
        expect(splits.length).toBe(60);

        // Check a specific split (e.g., 1/2)
        const split1_2 = splits.find(z =>
            z.bet.numbers.includes(1) && z.bet.numbers.includes(2)
        );
        expect(split1_2).toBeDefined();
    });
});
