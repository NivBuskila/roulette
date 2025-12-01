/**
 * Bet Validation Service
 * 
 * Validates all bet types according to European Roulette rules.
 * Ensures bets are properly structured and numbers are valid.
 */

import { Bet, ValidationResult } from '../types';
import { MIN_BET, MAX_BET } from '../constants/roulette';
import {
    validateStraight,
    validateSplitBet,
    validateStreetBet,
    validateCornerBet,
    validateLineBet,
} from './validators/inside-bets.validator';
import {
    validateColumnBet,
    validateDozenBet,
    validateColorBet,
    validateOddEvenBet,
    validateHighLowBet,
} from './validators/outside-bets.validator';

/**
 * Validates a single bet
 */
export function validateBet(bet: Bet): ValidationResult {
    // Check bet amount
    if (!bet.amount || bet.amount <= 0) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: 'Bet amount must be positive',
        };
    }

    if (bet.amount < MIN_BET) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: `Minimum bet is ${MIN_BET}`,
        };
    }

    if (bet.amount > MAX_BET) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: `Maximum bet is ${MAX_BET}`,
        };
    }

    // Check bet type
    if (!bet.type) {
        return {
            valid: false,
            errorCode: 'INVALID_BET_TYPE',
            errorMessage: 'Bet type is required',
        };
    }

    // Check numbers array
    if (!bet.numbers || !Array.isArray(bet.numbers)) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: 'Bet numbers must be an array',
        };
    }

    // Validate all numbers are in range 0-36
    for (const num of bet.numbers) {
        if (!Number.isInteger(num) || num < 0 || num > 36) {
            return {
                valid: false,
                errorCode: 'INVALID_BET',
                errorMessage: `Invalid number: ${num}. Must be integer between 0 and 36`,
            };
        }
    }

    // Validate based on bet type
    return validateBetType(bet);
}

/**
 * Validates bet type specific rules
 */
function validateBetType(bet: Bet): ValidationResult {
    switch (bet.type) {
        case 'straight':
            return validateStraight(bet.numbers);
        case 'split':
            return validateSplitBet(bet.numbers);
        case 'street':
            return validateStreetBet(bet.numbers);
        case 'corner':
            return validateCornerBet(bet.numbers);
        case 'line':
            return validateLineBet(bet.numbers);
        case 'column':
            return validateColumnBet(bet.numbers);
        case 'dozen':
            return validateDozenBet(bet.numbers);
        case 'red':
            return validateColorBet(bet.numbers, 'red');
        case 'black':
            return validateColorBet(bet.numbers, 'black');
        case 'odd':
            return validateOddEvenBet(bet.numbers, 'odd');
        case 'even':
            return validateOddEvenBet(bet.numbers, 'even');
        case 'low':
            return validateHighLowBet(bet.numbers, 'low');
        case 'high':
            return validateHighLowBet(bet.numbers, 'high');
        default:
            return {
                valid: false,
                errorCode: 'INVALID_BET_TYPE',
                errorMessage: `Unknown bet type: ${bet.type}`,
            };
    }
}

/**
 * Validates multiple bets and checks total against balance
 */
export function validateBets(bets: Bet[], balance: number): ValidationResult {
    if (!bets || !Array.isArray(bets) || bets.length === 0) {
        return {
            valid: false,
            errorCode: 'INVALID_BET',
            errorMessage: 'At least one bet is required',
        };
    }

    // Validate each bet
    for (const bet of bets) {
        const result = validateBet(bet);
        if (!result.valid) {
            return result;
        }
    }

    // Check total bet amount against balance
    const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
    if (totalBetAmount > balance) {
        return {
            valid: false,
            errorCode: 'INSUFFICIENT_BALANCE',
            errorMessage: `Total bet amount (${totalBetAmount}) exceeds balance (${balance})`,
        };
    }

    return { valid: true };
}
