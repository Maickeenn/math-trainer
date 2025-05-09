// tests/core/questionGenerator.test.js

import { describe, it, expect } from 'vitest';
import { generateQuestionByLevel } from '../../core/questionGenerator.js';

const OP_REGEX = {
  '+': /\d+( \+ \d+)+/,
  '-': /\d+( - \d+)+/,
  '*': /\d+ × \d+/,
  '/': /\d+ ÷ \d+/,
  '^': /\d+\^\d+/,
  'frac': /\d+\/\d+ [+-] \d+\/\d+/
};

const sampleMany = (level, attempts = 100) => {
  const seen = new Set();
  for (let i = 0; i < attempts; i++) {
    const { question } = generateQuestionByLevel(level);
    for (const [op, regex] of Object.entries(OP_REGEX)) {
      if (regex.test(question)) seen.add(op);
    }
  }
  return seen;
};

describe('generateQuestionByLevel()', () => {
  it('returns a valid question and answer object at level 1', () => {
    const q = generateQuestionByLevel(1);
    expect(q).toHaveProperty('question');
    expect(q).toHaveProperty('answer');
    expect(typeof q.answer).toBe('number');
    expect(OP_REGEX['+'].test(q.question)).toBe(true);
  });

  it('produces different questions on multiple calls', () => {
    const q1 = generateQuestionByLevel(6);
    const q2 = generateQuestionByLevel(6);
    expect(q1.question).not.toBe(q2.question);
  });

  it('includes all expected operators per level', () => {
    const expectedByLevel = {
      1: ['+'],
      5: ['+', '-'],
      8: ['+', '-', '*'],
      10: ['+', '-', '*', '/'],
      11: ['^'],
      12: ['frac']
    };

    for (const [levelStr, expectedOps] of Object.entries(expectedByLevel)) {
      const level = Number(levelStr);
      const found = sampleMany(level);
      expectedOps.forEach(op => {
        expect(found.has(op)).toBe(true);
      });
    }
  });

  it('has numeric answers for arithmetic operations', () => {
    const q = generateQuestionByLevel(4);
    expect(typeof q.answer).toBe('number');
    expect(Number.isFinite(q.answer)).toBe(true);
  });

  it('generates valid exponentiation and fraction formats', () => {
    const exp = generateQuestionByLevel(11);
    expect(exp.question).toMatch(OP_REGEX['^']);
    expect(typeof exp.answer).toBe('number');

    const frac = generateQuestionByLevel(12);
    expect(frac.question).toMatch(OP_REGEX['frac']);
    expect(typeof frac.answer).toBe('number');
    expect(Number.isFinite(frac.answer)).toBe(true);
  });
});
