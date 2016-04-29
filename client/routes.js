/*
*  Gets data from address bar using Iron-Router
*  Sets the session according this data.
*/
Router.configure({
  layoutTemplate: 'dummy' // layoutTemplate, not layout
});

Router.route('/:_id', {
  data: function () {
    var courses;
    var student = Router.current().params._id;
    Meteor.subscribe("this_courses", function(){
      Meteor.subscribe("students", student, function(){
        Meteor.subscribe("grades", student, function(){
          Session.set('student', student);
          Session.set("a", 0);
          Session.set("b", 0);
          Session.set("p", 0);
          Session.set("performance", (Students.findOne().performance/20)*100);
          Session.set("lwrMin",0);
          Session.set("lwrMax",0);
          Session.set("upprMax",0);
          Session.set("upprMin",0);
          Session.set("failFase",1);
          Session.set("passFase",1);
          $(".loading-screen").fadeOut(function(){
            $(this).remove();
          });
          Blaze.render(Template.regression,$("body")[0]);
        });
      });
    });
  }
});
