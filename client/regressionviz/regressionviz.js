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
    return Courses.find({},{sort: {credits: 1}});
  },
  performance() {
    return Session.get("performance");
  },
  prediction(){
    var p = Session.get("performance")/100;
    var a = Session.get("a");
    var b = Session.get("b");
    var r = (a * p) + b;
    Session.set("p",r.toFixed(2));
    var out = { p: (p*100),r: 100-((r/20)*100),t: r.toFixed(2), b:(100-((r/20)*100))-3};
    return out;
  },
  observations() {
    var arr = [];
    var color = "";
    var a = Session.get("a");
    var b = Session.get("b");
    var p = 0;
    var r = 0;
    for (var i = 0; i<1000; i++) {
      p = (Math.random()*100)/100;
      c = b + (Math.random() * 11) - 5;
      r = (a * p) + c;
      arr.push({x:(p*100).toFixed(1), y:(100-((r/20)*100)).toFixed(1), color: color});
    }
    return arr;
  },
  details() {
    // var b = $("input:checked");
    var p = parseFloat(Session.get("p"));
    return {lwr: (p-4.91).toFixed(2), upr: (p+4.91).toFixed(2)};
  }
});

Template.regression.events({
  "click .course"(event, instance) {
    instance.$("#cb-"+this._id).prop("checked", !instance.$("#cb-"+this._id).prop("checked"));
  },
  "change .performance-slider"(event, instance) {
    Session.set("performance", instance.$(".performance-slider").val());
  },
  "click .select-all"(event, instance) {
    instance.$(".ccb").prop("checked",true);
  },
  "click .unselect-all"(event, instance) {
    instance.$(".ccb").prop("checked",false);
  }
});

Template.regression.onCreated(function bodyOnCreated() {
  Session.set("performance",50);
  Session.set("a",14.65);
  Session.set("b",3.86);
  Session.set("ua",4.91);
  Session.set("ub",3.91);
});

Template.regression.rendered = function () {
  this.$("#slider").noUiSlider({
    start: [50],
    connect: 'lower',
    range: {
      'min': 0,
      'max': 100
    },
    pips: { // Show a scale with the slider
      mode: 'steps',
      density: 2
    }
  }).on('slide', function (ev, val) {
    var v  = parseFloat(val).toFixed(1);
    $('circle').css("fill","#b0b0b0").promise().done(function(){
      for(var i=0; i<10; i++) {
        var a = (parseFloat(v)-(i/10)).toFixed(1);
        var b = (parseFloat(v)+(i/10)).toFixed(1);
        $('circle[cx="'+a+'%"]').each(function() { $(this).css("fill","#B45C7E"); });
        $('circle[cx="'+b+'%"]').each(function() { $(this).css("fill","#B45C7E"); });
      }
    });
    $(".main-circle").css("fill","#8c3d5e");
    Session.set("performance",val);

  }).on('change', function (ev, val) {
    // round off values on 'change' event
    Session.set("performance",val);
  });
};
