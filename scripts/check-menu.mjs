import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
const source = readFileSync('public/assets/site.js', 'utf8');
const events = {}, navEvents = {};
let change;
const attributes = { 'aria-expanded': 'false' };
const button = {
  hidden: true, focused: false,
  setAttribute: (key, value) => { attributes[key] = value; },
  getAttribute: (key) => attributes[key],
  addEventListener: (type, fn) => { events[type] = fn; },
  focus() { this.focused = true; }
};
const nav = { hidden: false, addEventListener: (type, fn) => { navEvents[type] = fn; } };
const media = { matches: true, addEventListener: (type, fn) => { change = fn; } };
runInNewContext(source, {
  document: { querySelector: (query) => query === '.menu-toggle' ? button : nav },
  window: { matchMedia: () => media }
});
assert.equal(button.hidden, false);
assert.equal(nav.hidden, true);
events.click();
assert.equal(nav.hidden, false);
assert.equal(attributes['aria-expanded'], 'true');
navEvents.keydown({ key: 'Escape' });
assert.equal(nav.hidden, true);
assert.equal(button.focused, true);
events.click(); events.click();
assert.equal(nav.hidden, true);
media.matches = false; change();
assert.equal(nav.hidden, false);
assert.equal(button.hidden, true);
media.matches = true; change();
assert.equal(nav.hidden, true);
console.log('PASS: menu open, close, Escape focus return, desktop and mobile resize.');
