import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './regressionviz.html';

Template.regression.helpers({
  courses() {
    return Courses.find({});
  },
});

Template.regression.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
