Courses  = new Meteor.Collection('courses');

Template.regression.helpers({
  regressionLine() {
    var line = Courses.findOne();
    //((14.65* 1.0) + 3.86)/20;
    var y1 = 100-(3.86/20)*100;
    var y2 = 100-(18.51/20)*100;
    return {
      y1: y1,
      y2: y2
    };
  },
  students() {
    return 123;
  },
  prediction() {
  }
});

Template.regression.events({
  'click'(event, instance) {
    console.log(event.target);
  },
});
