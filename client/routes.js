/*
*  Gets data from address bar using Iron-Router
*  Sets the session according this data.
*/
Router.configure({
  layoutTemplate: 'regression' // layoutTemplate, not layout
});

Router.route('/:_id', {
  data: function () {
    var courses;
    var student = Router.current().params._id;

    Meteor.subscribe("this_courses");
    Meteor.subscribe("students", student);
    Meteor.subscribe("grades", student);

    Session.set('student', student);
    Session.set("a", 1);
    Session.set("b", 1);
    Session.set("p", 1);
    Session.set("performance", 80);
    Session.set("lwrMin",1);
    Session.set("lwrMax",1);
    Session.set("upprMax",1);
    Session.set("upprMin",1);
  }
});
