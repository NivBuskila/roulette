import { describe, it, expect } from 'vitest';
import { CHIP_VALUES, ChipValue } from '../constants/roulette';

describe('ChipSelector Component Logic', () => {
    describe('Chip Values', () => {
        it('should have correct chip denominations', () => {
            expect(CHIP_VALUES).toEqual([1, 5, 10, 25, 100]);
        });

        it('should have 5 chip values in ascending order', () => {
            expect(CHIP_VALUES.length).toBe(5);
            for (let i = 0; i < CHIP_VALUES.length - 1; i++) {
                expect(CHIP_VALUES[i]).toBeLessThan(CHIP_VALUES[i + 1]);
            }
        });

        it('should not have negative or duplicate values', () => {
            CHIP_VALUES.forEach(value => expect(value).toBeGreaterThan(0));
            const uniqueValues = new Set(CHIP_VALUES);
            expect(uniqueValues.size).toBe(CHIP_VALUES.length);
        });
    });

    describe('Chip Selection Logic', () => {
        let selectedChip: ChipValue = CHIP_VALUES[0];

        const selectChip = (value: ChipValue): void => {
            if (CHIP_VALUES.includes(value)) {
                selectedChip = value;
            }
        };

        const getSelectedChip = (): ChipValue => selectedChip;

        it('should start with default chip value of 1', () => {
            expect(getSelectedChip()).toBe(1);
        });

        it('should update selected chip when valid value is chosen', () => {
            selectChip(10);
            expect(getSelectedChip()).toBe(10);
            selectChip(25);
            expect(getSelectedChip()).toBe(25);
        });

        it('should handle selection of all valid chips', () => {
            CHIP_VALUES.forEach(value => {
                selectChip(value);
                expect(getSelectedChip()).toBe(value);
            });
        });
    });

    describe('Chip Positioning', () => {
        const calculateChipPositions = (): number[] => {
            const spacing = 90;
            const startX = -((CHIP_VALUES.length - 1) * spacing) / 2;
            return CHIP_VALUES.map((_, index) => startX + index * spacing);
        };

        it('should calculate correct positions centered around x=0', () => {
            const positions = calculateChipPositions();
            expect(positions.length).toBe(CHIP_VALUES.length);
            const sum = positions.reduce((a, b) => a + b, 0);
            expect(Math.abs(sum)).toBeLessThan(1); // Should be approximately 0
        });

        it('should have equal spacing between chips', () => {
            const positions = calculateChipPositions();
            const spacing = 90;
            for (let i = 0; i < positions.length - 1; i++) {
                expect(positions[i + 1] - positions[i]).toBe(spacing);
            }
        });
    });
});
