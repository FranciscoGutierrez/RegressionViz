Courses  = new Meteor.Collection('courses');

Template.regression.helpers({
  regressionLine() {
    var line = Courses.findOne();
    //((14.65* 1.0) + 3.86)/20;
    var y1 = 100-(3.86/20)*100;
    var y2 = 100-(18.51/20)*100;
    return {
      y1: y1,
      y2: y2,
      a1: y1-5.5,
      a2: y2-5.5,
      b1: y1-11,
      b2: y2-11,
      c1: y1-16.5,
      c2: y2-16.5,
      d1: y1-22,
      d2: y2-22,
      aa1: y1 + 5.5,
      aa2: y2 + 5.5,
      bb1: y1 + 11,
      bb2: y2 + 11,
      cc1: y1 + 16.5,
      cc2: y2 + 16.5,
      dd1: y1 + 22,
      dd2: y2 + 22
    };
  },
  courses() {
    return Courses.find({});
  },
  prediction() {
  }
});

Template.regression.events({
  'click'(event, instance) {
    console.log(event.target);
  },
});
