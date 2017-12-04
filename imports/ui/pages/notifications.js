import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import { Galleries } from '../../api/galleries.js';
import { Uploads } from '../../api/uploads.js';
import { SubmitRequests } from '../../api/submitrequests.js';
import { Activities } from '../../api/activities.js';

import './notifications.html';
import '../components/header.js';
import '../components/submitRequestUI.js';

Template.notifications.onCreated(function() {
  this.state = new ReactiveDict();
  Meteor.subscribe('uploads');
  Meteor.subscribe('galleries');
	Meteor.subscribe('submitrequests');
	Meteor.subscribe('userData');
	Meteor.subscribe('activities');
});

Template.notifications.helpers({
	following: function() {
		var folIds = Meteor.user().following;
		console.log(folIds);
		if (folIds !== undefined) {
			return Meteor.users.find({_id: { $in: folIds }});
		}
		return [];
	},
	notFollowing: function() {
		var folIds2 = Meteor.user().following;
		if (folIds2 !== undefined) {
			//TODO: get urself off the not following list.
			return Meteor.users.find({ $and: [{_id: { $not: { $in: folIds2 } } }, {_id: { $not: Meteor.userId() }}] });
		}
		return Meteor.users.find({_id: { $not: Meteor.userId() } });
	},
	followActivity: function() {
		return Activities.find({reciever: Meteor.userId()});
	},
	requests: function() {
		return SubmitRequests.find({to: Meteor.userId()});
	}
});

Template.notifications.events({
  'submit #addFollow'(event) {
		event.preventDefault();
		console.log(event);
		console.log(Meteor.user());
		var addSelector = Template.instance().find('#addSelector');
		var newFollowArray = Meteor.user().following;
		console.log(newFollowArray);
		if (newFollowArray === undefined) {
			newFollowArray = [];
		}
		newFollowArray.push(addSelector.options[addSelector.selectedIndex].value);
		console.log(newFollowArray);
		Meteor.users.update({_id: Meteor.userId()}, {
			$set: {
				"following": newFollowArray
			}
		});
		alert("You are now following someone new.");
	},
	'submit #removeFollow'(event) {
		event.preventDefault();
		console.log(event);
		console.log(Meteor.user());
		var addSelector = Template.instance().find('#removeSelector');
		var newFollowArray = Meteor.user().following;
		console.log(newFollowArray);
		var index = newFollowArray.indexOf(addSelector.options[addSelector.selectedIndex].value);
		newFollowArray.splice(index, 1);
		console.log(newFollowArray);
		Meteor.users.update({_id: Meteor.userId()}, {
			$set: {
				"following": newFollowArray
			}
		});
		alert("You are no longer following that user.");
	},
});

//ACTIVITIES TEMPLATE

Template.activity.onCreated(function() {
	Meteor.subscribe('activities');
});

Template.activity.helpers({
	newGallery: function() {
		return (this.type === "new gallery");
	}
});

Template.activity.events({
	'click #markRead'(event) {
		event.preventDefault();
		console.log(event);
		Activities.remove(this._id);
	}
});