import { describe, it, expect } from 'vitest';
import { WHEEL_ORDER, getNumberColor } from '../constants/roulette';

describe('Wheel Component Logic', () => {
    describe('Wheel Order', () => {
        it('should have 37 numbers (0-36)', () => {
            expect(WHEEL_ORDER.length).toBe(37);
        });

        it('should contain all numbers from 0 to 36', () => {
            const sortedOrder = [...WHEEL_ORDER].sort((a, b) => a - b);
            for (let i = 0; i <= 36; i++) {
                expect(sortedOrder[i]).toBe(i);
            }
        });

        it('should start with 0', () => {
            expect(WHEEL_ORDER[0]).toBe(0);
        });

        it('should match European roulette order', () => {
            const expectedOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
            expect(WHEEL_ORDER).toEqual(expectedOrder);
        });

        it('should not have duplicate numbers', () => {
            const uniqueNumbers = new Set(WHEEL_ORDER);
            expect(uniqueNumbers.size).toBe(37);
        });
    });

    describe('Angle Calculation', () => {
        const calculateAngleForNumber = (number: number): number => {
            const index = WHEEL_ORDER.indexOf(number);
            const segmentAngle = 360 / 37;
            return index * segmentAngle;
        };

        it('should calculate angle for number 0', () => {
            const angle = calculateAngleForNumber(0);
            expect(angle).toBe(0);
        });

        it('should calculate angle for number 32 (second position)', () => {
            const angle = calculateAngleForNumber(32);
            const expectedAngle = 360 / 37;
            expect(angle).toBeCloseTo(expectedAngle, 2);
        });

        it('should calculate angles within valid range (0-360)', () => {
            for (let num = 0; num <= 36; num++) {
                const angle = calculateAngleForNumber(num);
                expect(angle).toBeGreaterThanOrEqual(0);
                expect(angle).toBeLessThan(360);
            }
        });

        it('should have unique angles for each number', () => {
            const angles = WHEEL_ORDER.map((num, index) => (index * 360) / 37);
            const uniqueAngles = new Set(angles);
            expect(uniqueAngles.size).toBe(37);
        });

        it('should calculate segment size correctly', () => {
            const segmentSize = 360 / 37;
            expect(segmentSize).toBeCloseTo(9.73, 2);
        });
    });

    describe('Number Color Mapping', () => {
        it('should return green for 0', () => {
            expect(getNumberColor(0)).toBe('green');
        });

        it('should return red for red numbers', () => {
            const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
            redNumbers.forEach(num => {
                expect(getNumberColor(num)).toBe('red');
            });
        });

        it('should return black for black numbers', () => {
            const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
            blackNumbers.forEach(num => {
                expect(getNumberColor(num)).toBe('black');
            });
        });

        it('should have 18 red numbers', () => {
            let redCount = 0;
            for (let i = 1; i <= 36; i++) {
                if (getNumberColor(i) === 'red') redCount++;
            }
            expect(redCount).toBe(18);
        });

        it('should have 18 black numbers', () => {
            let blackCount = 0;
            for (let i = 1; i <= 36; i++) {
                if (getNumberColor(i) === 'black') blackCount++;
            }
            expect(blackCount).toBe(18);
        });

        it('should have exactly 1 green number (0)', () => {
            let greenCount = 0;
            for (let i = 0; i <= 36; i++) {
                if (getNumberColor(i) === 'green') greenCount++;
            }
            expect(greenCount).toBe(1);
        });

        it('should handle all numbers 0-36 without errors', () => {
            for (let i = 0; i <= 36; i++) {
                const color = getNumberColor(i);
                expect(['red', 'black', 'green']).toContain(color);
            }
        });

        it('should alternate colors on wheel mostly', () => {
            // European roulette should have mostly alternating colors
            let alternations = 0;
            for (let i = 0; i < WHEEL_ORDER.length - 1; i++) {
                const currentColor = getNumberColor(WHEEL_ORDER[i]);
                const nextColor = getNumberColor(WHEEL_ORDER[i + 1]);
                if (currentColor !== nextColor && currentColor !== 'green' && nextColor !== 'green') {
                    alternations++;
                }
            }
            // Most adjacent numbers should have different colors
            expect(alternations).toBeGreaterThan(20);
        });
    });

    describe('Wheel Geometry', () => {
        const WHEEL_RADIUS = 300;
        const SEGMENT_COUNT = 37;

        it('should have correct segment count', () => {
            expect(SEGMENT_COUNT).toBe(37);
        });

        it('should calculate segment angle in radians correctly', () => {
            const segmentAngleRad = (Math.PI * 2) / SEGMENT_COUNT;
            const expectedAngle = (2 * Math.PI) / 37;
            expect(segmentAngleRad).toBeCloseTo(expectedAngle, 5);
        });

        it('should position numbers on the wheel correctly', () => {
            const textRadius = WHEEL_RADIUS - 35;
            const segmentAngle = (Math.PI * 2) / SEGMENT_COUNT;

            // Test number 17 (9th position on wheel, index 8)
            const index17 = WHEEL_ORDER.indexOf(17);
            const midAngle = (index17 * segmentAngle) + (segmentAngle / 2) - (Math.PI / 2);
            const textX = Math.cos(midAngle) * textRadius;
            const textY = Math.sin(midAngle) * textRadius;

            // Coordinates should be within wheel radius
            const distance = Math.sqrt(textX * textX + textY * textY);
            expect(distance).toBeLessThanOrEqual(WHEEL_RADIUS);
            expect(distance).toBeGreaterThan(0);
        });
    });

    describe('Spin Target Calculation', () => {
        const calculateTargetRotation = (winningNumber: number, spins: number = 4): number => {
            const index = WHEEL_ORDER.indexOf(winningNumber);
            const segmentAngle = 360 / 37;
            const targetAngle = index * segmentAngle;
            const totalRotation = (360 * spins) + targetAngle;
            return totalRotation;
        };

        it('should calculate correct rotation for number 0', () => {
            const rotation = calculateTargetRotation(0, 4);
            expect(rotation).toBe(360 * 4); // 4 full rotations
        });

        it('should calculate correct rotation for number 17', () => {
            const index = WHEEL_ORDER.indexOf(17);
            const segmentAngle = 360 / 37;
            const expectedRotation = (360 * 4) + (index * segmentAngle);
            const rotation = calculateTargetRotation(17, 4);
            expect(rotation).toBeCloseTo(expectedRotation, 2);
        });

        it('should add full rotations correctly', () => {
            const rotation3 = calculateTargetRotation(0, 3);
            const rotation5 = calculateTargetRotation(0, 5);
            expect(rotation5 - rotation3).toBe(360 * 2);
        });

        it('should calculate different rotations for different numbers', () => {
            const rotation1 = calculateTargetRotation(1, 4);
            const rotation2 = calculateTargetRotation(2, 4);
            expect(rotation1).not.toBe(rotation2);
        });

        it('should have positive rotation values', () => {
            for (let num = 0; num <= 36; num++) {
                const rotation = calculateTargetRotation(num, 4);
                expect(rotation).toBeGreaterThanOrEqual(0);
            }
        });
    });
});
