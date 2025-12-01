import { ValidationResult } from '../../types';
import {
    isValidSplit,
    isValidStreet,
    isValidCorner,
    isValidLine,
} from '../../constants/roulette';

export function validateStraight(numbers: number[]): ValidationResult {
    if (numbers.length !== 1) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: 'Straight bet must have exactly 1 number',
        };
    }
    return { valid: true };
}

export function validateSplitBet(numbers: number[]): ValidationResult {
    if (!isValidSplit(numbers)) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: 'Split bet must have 2 adjacent numbers',
        };
    }
    return { valid: true };
}

export function validateStreetBet(numbers: number[]): ValidationResult {
    if (!isValidStreet(numbers)) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: 'Street bet must have 3 numbers in a row',
        };
    }
    return { valid: true };
}

export function validateCornerBet(numbers: number[]): ValidationResult {
    if (!isValidCorner(numbers)) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: 'Corner bet must have 4 numbers forming a square',
        };
    }
    return { valid: true };
}

export function validateLineBet(numbers: number[]): ValidationResult {
    if (!isValidLine(numbers)) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: 'Line bet must have 6 numbers (two adjacent streets)',
        };
    }
    return { valid: true };
}
