Courses  = new Meteor.Collection('courses');
Grades   = new Meteor.Collection('studentscourses');
Students = new Meteor.Collection('students');

Meteor.publish("this_courses", function () {
  return Courses.find();
});

Meteor.publish('grades', function(who){
  console.log(who);
  return Grades.find({"student": Number(who)});
});

Meteor.publish('students', function(who){
  console.log(who);
  return Students.find({ "_id": Number(who)});
});
