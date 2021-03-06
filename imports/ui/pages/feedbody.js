import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
//import {Router} from 'meteor/iron:router';
import { Galleries } from '../../api/galleries.js';
import './feedbody.html';
import '../components/gallery-in-feed.js';
import '../components/uploads-grid.js';
import '../components/header.js';

Template.feedbody.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('uploads');
  Meteor.subscribe('userData'); //for getting who they're following
});

Template.feedbody.helpers({
  galleries: function() {
    //retrieve all of this user's galleries, or just the subscribed ones if the checkbox is checked.
    const instance = Template.instance();
    if (instance.state.get('show-following-only')) {
      var following = Meteor.user().following;
      return Galleries.find({owner: { $in: following } });
    }
    return Galleries.find();
  }
});

Template.feedbody.events({
  'change #show-following-only'(event, instance) {
    instance.state.set('show-following-only', event.target.checked);
  }
});