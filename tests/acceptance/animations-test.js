import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { later } from '@ember/runloop';

function opacity(selector) {
  return +document.querySelector(selector).style.opacity;
}

function translateY(selector) {
  return +document.querySelector(selector).style.transform.replace(/translateY\(|px\)/g, '');
}

module('Acceptance | animations', function (hooks) {
  setupApplicationTest(hooks);

  test('concurrent animations across different components', async function (assert) {
    await visit('/concurrent/index');

    // index starts fading in
    assert.ok(opacity('.index') < 0.1);

    await new Promise((res) => later(res, 500));

    // index finishes fading in
    assert.ok(opacity('.index') > 0.99);

    await visit('/concurrent/other');

    // index starts fading out
    assert.ok(opacity('.index') < 1);

    // other starts fading in
    assert.ok(opacity('.other') > 0);

    await new Promise((res) => later(res, 400));

    // index finishes fading out
    assert.ok(opacity('.index') < 0.2);

    await new Promise((res) => later(res, 100));

    // index tearsdown
    assert.notOk(document.querySelector('.index'));

    // other finishes fading in
    assert.ok(opacity('.other') > 0.99);
  });

  test('animations block their own queue', async function (assert) {
    await visit('/concurrent/index');

    // index starts fading in
    assert.ok(opacity('.index') < 0.1);

    await new Promise((res) => later(res, 500));

    await visit('/concurrent/other');

    await new Promise((res) => later(res, 250));

    // index has started fading out
    assert.ok(opacity('.index') < 0.6);
    assert.ok(opacity('.index') > 0.3);

    await visit('/concurrent/index');

    await new Promise((res) => later(res, 250));

    // index continues fading out
    assert.ok(opacity('.index') < 0.1);

    await new Promise((res) => later(res, 250));

    // index now starts fading back in
    assert.ok(opacity('.index') > 0.3);

    await new Promise((res) => later(res, 250));

    // index finishes fading back in
    assert.ok(opacity('.index') > 0.9);
  });

  test('animations can be non-blocking', async function (assert) {
    await visit('/non-blocking/index');

    // index starts translating in
    assert.ok(translateY('.index') > 0);

    await new Promise((res) => later(res, 500));

    // index finishes translating in
    assert.ok(translateY('.index') > 195);

    await visit('/non-blocking/other');

    await new Promise((res) => later(res, 250));

    // index has started translating out
    assert.ok(translateY('.index') < 100);
    assert.ok(translateY('.index') > 60);

    await visit('/non-blocking/index');

    await new Promise((res) => later(res, 500));

    // index has reversed and translated back in
    assert.ok(translateY('.index') > 195);
  });

  test('animations can share the same queue', async function (assert) {
    await visit('/shared/index');

    await new Promise((res) => later(res, 500));

    // index finishes fading in
    assert.ok(opacity('.index') > 0.99);

    await visit('/shared/other');

    await new Promise((res) => later(res, 250));

    // index has started fading out, other has not been inserted into DOM yet
    assert.ok(opacity('.index') < 0.6);
    assert.notOk(document.querySelector('.other'));

    await new Promise((res) => later(res, 300));

    // index has torn down, other starts fading in
    assert.ok(opacity('.other') > 0);
    assert.notOk(document.querySelector('.index'));

    await new Promise((res) => later(res, 450));

    // other finishes fading in
    assert.ok(opacity('.other') > 0.9, opacity('.other'));
  });

  test('animations that share the same queue can be interrupted', async function (assert) {
    await visit('/shared/index');

    await new Promise((res) => later(res, 500));

    // index finishes fading in
    assert.ok(opacity('.index') > 0.99);

    await visit('/shared/other');

    await new Promise((res) => later(res, 250));

    // index has started fading out, other has not been inserted into DOM yet
    assert.ok(opacity('.index') < 0.6);
    assert.notOk(document.querySelector('.other'));

    await visit('/shared/index');

    await new Promise((res) => later(res, 250));

    // index continues to fade out
    assert.ok(opacity('.index') < 0.1);
    assert.notOk(document.querySelector('.other'));

    await new Promise((res) => later(res, 100));

    // index reverses and fades in, other not inserted
    assert.ok(opacity('.index') > 0.1);
    assert.notOk(document.querySelector('.other'));

    await new Promise((res) => later(res, 400));

    // index has reversed and faded back in, other never inserted
    assert.ok(opacity('.index') > 0.9, opacity('.index'));
    assert.notOk(document.querySelector('.other'));
  });
});
