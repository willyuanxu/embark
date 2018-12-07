import DS from 'ember-data';

export default DS.Model.extend({
	plan: DS.belongsTo('plan'),
	name: DS.attr('string'),
	attractions: DS.attr(),
});
