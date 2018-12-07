import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | travel-plans', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:travel-plans');
    assert.ok(route);
  });
});
