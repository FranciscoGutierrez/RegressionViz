Courses  = new Meteor.Collection('courses');
Grades   = new Meteor.Collection('studentscourses');

Meteor.publish("this_courses", function () {
  return Courses.find();
});

Meteor.publish('grades', function(who){
  var size = who.length * 100;
  return Grades.find({code:{$in:who}}, {limit: size});
});
