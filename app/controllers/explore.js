import Controller from '@ember/controller';
import RSVP from 'rsvp';
import { A } from '@ember/array';

export default Controller.extend({
	currPOI: [],
	currCities: [], 
	currPlan: {
		
	},

	getAttractionIndex(city, attraction){
		if (city in this.currPlan){
			var index = this.currPlan[city]['attractions'].indexOf(attraction);
			return index;
		} else {
			return -1;
		}
	},



	actions: {

		getPlan(){
			var keys = Object.keys(this.currPlan);
			var returnVal = [];
			keys.forEach((key) => {
				returnVal.push(this.currPlan[key]);
			});
			return returnVal;
		},

		addToPlan(city, attraction){
			if (city in this.currPlan){
				if (this.currPlan[city]['attractions'].indexOf(attraction) == -1){
					this.currPlan[city]['attractions'].push(attraction);
				}
			} else {
				this.currPlan[city] = {
					name: city,
					attractions: [attraction],
				};
			}
		},


		removeFromPlan(city, attraction){
			var index = this.getAttractionIndex(city, attraction);
			if (index != -1){
				this.currPlan[city]['attractions'].splice(index, 1);
				if (this.currPlan[city]['attractions'].length == 0){
					delete this.currPlan[city];
				}
			}
		},


		getCurrPOI(){
			return this.currPOI;
		},
		updateCurrPOI(loc){
			this.currPOI.push(loc);
		}, 

		destroyCurrPOI(){
			this.currPOI = [];
		},

		addCurrCity(loc){
			this.currCities.push(loc);
		},

		getCurrCities(){
			return this.currCities;
		},

		destroyCurrCities(){
			this.currCities = [];
		},

		savePlan(){
			var cityNames = Object.keys(this.currPlan);
			var plan = this.store.createRecord('plan', {
				name: "My Plan",
			});
			var promises = A();
			cityNames.forEach((cityName) => {
				var city = this.store.createRecord('city', {
						name: cityName,
						attractions: this.currPlan[cityName]['attractions'],
				});
				plan.get('cities').pushObject(city);
				promises.push(city.save());
			});
			RSVP.Promise.all(promises).then(() => {
				console.log("all saved!");
				plan.save().then(()=> {
					this.currPOI = [];
					this.currPlan = {};
					this.transitionToRoute('travel-plans');
				});
			});
			

			

		}
	},
	
});
