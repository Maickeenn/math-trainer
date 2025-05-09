// utils/domUtils.js

export function setElementText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

export function setInputValue(id, value = '') {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

export function setElementVisibility(id, visible) {
  const el = document.getElementById(id);
  if (el) el.style.display = visible ? 'inline-block' : 'none';
}

export function setBlockVisibility(id, visible) {
  const el = document.getElementById(id);
  if (el) el.style.display = visible ? 'block' : 'none';
}

export function appendRowToTable(id, rowHTML) {
  const el = document.querySelector(`#${id} tbody`);
  if (el) el.innerHTML += rowHTML;
}

export function clearTable(id) {
  const el = document.querySelector(`#${id} tbody`);
  if (el) el.innerHTML = '';
}
