import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	cities: DS.hasMany('city', {async: false}),

});
