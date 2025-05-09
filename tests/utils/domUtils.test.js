// tests/utils/domUtils.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import {
  setElementText,
  setInputValue,
  setElementVisibility,
  setBlockVisibility,
  appendRowToTable,
  clearTable
} from '../../utils/domUtils.js';

describe('domUtils', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="text"></div>
      <input id="input" />
      <div id="inline"></div>
      <div id="block"></div>
      <table id="table"><tbody></tbody></table>
    `;
  });

  it('sets text of an element', () => {
    setElementText('text', 'Hello World');
    expect(document.getElementById('text').innerText).toBe('Hello World');
  });

  it('sets value of an input element', () => {
    setInputValue('input', '123');
    expect(document.getElementById('input').value).toBe('123');
  });

  it('toggles inline-block visibility', () => {
    setElementVisibility('inline', false);
    expect(document.getElementById('inline').style.display).toBe('none');
    setElementVisibility('inline', true);
    expect(document.getElementById('inline').style.display).toBe('inline-block');
  });

  it('toggles block visibility', () => {
    setBlockVisibility('block', true);
    expect(document.getElementById('block').style.display).toBe('block');
    setBlockVisibility('block', false);
    expect(document.getElementById('block').style.display).toBe('none');
  });

  it('appends rows to table and clears it', () => {
    appendRowToTable('table', '<tr><td>Row 1</td></tr>');
    appendRowToTable('table', '<tr><td>Row 2</td></tr>');
    const rows = document.querySelectorAll('#table tbody tr');
    expect(rows.length).toBe(2);

    clearTable('table');
    expect(document.querySelectorAll('#table tbody tr').length).toBe(0);
  });
});
