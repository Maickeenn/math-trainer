// tests/core/sessionManager.test.js

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCurrentLevel,
  setCurrentLevel,
  adjustLevel,
  resetTimer,
  togglePause,
  getFormattedTime,
  startTimer
} from '../../core/sessionManager.js';

describe('sessionManager', () => {
  beforeEach(() => {
    resetTimer();
    setCurrentLevel(1);
  });

  it('starts at level 1 by default', () => {
    expect(getCurrentLevel()).toBe(1);
  });

  it('can update and retrieve the current level', () => {
    setCurrentLevel(5);
    expect(getCurrentLevel()).toBe(5);
  });

  it('advances level when answer is correct and fast', () => {
    setCurrentLevel(2);
    const newLevel = adjustLevel(true, 2); // fast and correct
    expect(newLevel).toBeGreaterThan(2);
  });

  it('keeps or lowers level when answer is incorrect or slow', () => {
    setCurrentLevel(4);
    const newLevel = adjustLevel(false, 20); // slow and wrong
    expect(newLevel).toBeLessThanOrEqual(3);
  });

  it('toggles pause state correctly', () => {
    const paused = togglePause();
    expect(paused).toBe(true);
    const resumed = togglePause();
    expect(resumed).toBe(false);
  });

  it('formats time as mm:ss', () => {
    const time = getFormattedTime();
    expect(time).toMatch(/^\d{2}:\d{2}$/);
  });

  it('calls onTick and onFinish in startTimer after delay', async () => {
    vi.useFakeTimers();

    const onTick = vi.fn();
    const onFinish = vi.fn();

    startTimer(onTick, onFinish);

    vi.advanceTimersByTime(1000); // 1s
    expect(onTick).toHaveBeenCalled();
    expect(onFinish).not.toHaveBeenCalled();

    vi.advanceTimersByTime(600 * 1000); // total of 10 min
    expect(onFinish).toHaveBeenCalled();

    vi.useRealTimers();
  });
});