import { ValidationResult } from '../../types';
import {
    RED_NUMBERS,
    BLACK_NUMBERS,
    COLUMNS,
    DOZENS,
    LOW_NUMBERS,
    HIGH_NUMBERS,
    ODD_NUMBERS,
    EVEN_NUMBERS,
} from '../../constants/roulette';

function arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export function validateColumnBet(numbers: number[]): ValidationResult {
    if (numbers.length !== 12) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: 'Column bet must have exactly 12 numbers',
        };
    }

    // Check if numbers match one of the columns
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const col1 = [...COLUMNS[1]].sort((a, b) => a - b);
    const col2 = [...COLUMNS[2]].sort((a, b) => a - b);
    const col3 = [...COLUMNS[3]].sort((a, b) => a - b);

    const matchesColumn =
        arraysEqual(sortedNumbers, col1) ||
        arraysEqual(sortedNumbers, col2) ||
        arraysEqual(sortedNumbers, col3);

    if (!matchesColumn) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: 'Column bet numbers must match a valid column',
        };
    }

    return { valid: true };
}

export function validateDozenBet(numbers: number[]): ValidationResult {
    if (numbers.length !== 12) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: 'Dozen bet must have exactly 12 numbers',
        };
    }

    // Check if numbers match one of the dozens
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const doz1 = [...DOZENS[1]].sort((a, b) => a - b);
    const doz2 = [...DOZENS[2]].sort((a, b) => a - b);
    const doz3 = [...DOZENS[3]].sort((a, b) => a - b);

    const matchesDozen =
        arraysEqual(sortedNumbers, doz1) ||
        arraysEqual(sortedNumbers, doz2) ||
        arraysEqual(sortedNumbers, doz3);

    if (!matchesDozen) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: 'Dozen bet numbers must match a valid dozen (1-12, 13-24, or 25-36)',
        };
    }

    return { valid: true };
}

export function validateColorBet(numbers: number[], color: 'red' | 'black'): ValidationResult {
    if (numbers.length !== 18) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: `${color} bet must have exactly 18 numbers`,
        };
    }

    const expectedNumbers = color === 'red' ? [...RED_NUMBERS] : [...BLACK_NUMBERS];
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const sortedExpected = expectedNumbers.sort((a, b) => a - b);

    if (!arraysEqual(sortedNumbers, sortedExpected)) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: `${color} bet numbers must match all ${color} numbers`,
        };
    }

    return { valid: true };
}

export function validateOddEvenBet(numbers: number[], type: 'odd' | 'even'): ValidationResult {
    if (numbers.length !== 18) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: `${type} bet must have exactly 18 numbers`,
        };
    }

    const expectedNumbers = type === 'odd' ? [...ODD_NUMBERS] : [...EVEN_NUMBERS];
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const sortedExpected = expectedNumbers.sort((a, b) => a - b);

    if (!arraysEqual(sortedNumbers, sortedExpected)) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: `${type} bet numbers must match all ${type} numbers`,
        };
    }

    return { valid: true };
}

export function validateHighLowBet(numbers: number[], type: 'high' | 'low'): ValidationResult {
    if (numbers.length !== 18) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: `${type} bet must have exactly 18 numbers`,
        };
    }

    const expectedNumbers = type === 'low' ? [...LOW_NUMBERS] : [...HIGH_NUMBERS];
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const sortedExpected = expectedNumbers.sort((a, b) => a - b);

    if (!arraysEqual(sortedNumbers, sortedExpected)) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: `${type} bet numbers must be ${type === 'low' ? '1-18' : '19-36'}`,
        };
    }

    return { valid: true };
}
