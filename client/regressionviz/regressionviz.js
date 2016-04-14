Courses  = new Meteor.Collection('courses');
Session.setDefault("a", 2);
Session.setDefault("b", 12);
Session.setDefault("p", 11.70);
Session.setDefault("performance", 80);

Template.regression.helpers({
  regressionLine() {
    var a = Session.get("a");
    var b = Session.get("b");
    var y1 = 0;
    var y2 = 0;
    if(a) {
      y1 = 100-(a/20)*100;
      y2 = 100-((b+a)/20)*100;
    }
    return {
      y1: y1,
      y2: y2,
      a1: y1-5,
      a2: y2-5,
      b1: y1-10,
      b2: y2-10,
      c1: y1-15,
      c2: y2-15,
      d1: y1-20,
      d2: y2-20,
      aa1: y1 + 5,
      aa2: y2 + 5,
      bb1: y1 + 10,
      bb2: y2 + 10,
      cc1: y1 + 15,
      cc2: y2 + 15,
      dd1: y1 + 20,
      dd2: y2 + 20
    };
  },
  courses() {
    return Courses.find({},{sort: {credits: 1}});
  },
  performance() {
    return Math.round(Session.get("performance"));
  },
  legendPerformance() {
    var p = Session.get("performance");
    var t = "";
    if(p <  20) t= "Insufficient";
    if(p >= 20) t= "More Work is Required";
    if(p >= 40) t= "Sufficient";
    if(p >= 60) t= "Good";
    if(p >= 80) t= "Excellent";
    return t;
  },
  legendPrediction() {
    var p = Session.get("p");
    var t = "";
    if(p <  7)  t= "Fail";
    if(p >= 7)  t= "Tolerated";
    if(p >= 10) t= "Pass";
    if(p >= 14) t= "Good";
    if(p >= 16) t= "Very Good";
    if(p >= 18) t= "Excellent";
    if(p >= 20) t= "Outstanding";
    return t;
  },
  predictionValue(){
    return Session.get("p");
  },
  prediction(){
    var p = Session.get("performance")/100;
    var a = Session.get("a");
    var b = Session.get("b");
    var r = a + (b * p);
    if(r<0) r=0;
    Session.set("p",r.toFixed(2));
    var out = { p: (p*100),r: 100-((r/20)*100),t: r.toFixed(2), b:(100-((r/20)*100))-3};
    return out;
  },
  observations() {
    var arr = [];
    var a = 0;
    var b = 0;
    var x = 0;
    var y = 0;
    var p = 0;
    var r = 0;
    a = Session.get("a");
    b = Session.get("b");
    if (a != 0) {
      for (var i = 0; i<500; i++) {
        p = (Math.random()*100)/100;
        c = b + (Math.random() * 10) - 5;
        r = a + (c * p);
        x = (p*100).toFixed(1);
        y = (100-((r/20)*100)).toFixed(1);
        arr.push({x:x, y:y});
      }
    }
    return arr;
  },
  details() {
    var p = parseFloat(Session.get("p"));
    var u = (p+4.91).toFixed(2);
    var l = (p-4.91).toFixed(2);
    if(l<0) l = 0.00;
    var g = (u-10)*10;
    var r = (7-l)*10;
    if(g<0) g = 0;
    var y = 100-(g+r);
    return {lwr: l, upr: u, red: r, yellow: y, green:g};
  }
});

Template.regression.events({
  "click .course"(event, instance) {
    // instance.$("#cb-"+this._id).prop("checked", !instance.$("#cb-"+this._id).prop("checked"));
    $(".observations").css("fill", "#b0b0b0");
    var arr = $('input:checkbox:checked').map(function () {
      return this.value;
    }).get();
    if (arr.length <= 0) {
      $(".uline").fadeOut(function(){
        Session.set("a",0);
        Session.set("b",0);
        Session.set("maxFit",0);
        Session.set("minFit",0);
        Session.set("lwrMin",0);
        Session.set("lwrMax",0);
        Session.set("upprMax",0);
        Session.set("upprMin",0);
      });
    } else {
      var courses = Courses.find({ "_id":{ $in: arr  }}).fetch();
      var a = 0;
      var b = 0;
      var maxFit = 0;
      var minFit = 0;
      var lwrMin = 0;
      var lwrMax = 0;
      var upprMax = 0;
      var upprMin = 0;
      for(var i = 0; i<courses.length; i++) {
        a += courses[i].a;
        b += courses[i].b;
        maxFit += courses[i].maxFit;
        minFit += courses[i].minFit;
        lwrMin += courses[i].lwrMin;
        lwrMax += courses[i].lwrMax;
        upprMax += courses[i].upprMax;
        upprMin += courses[i].upprMin;
      }
      Session.set("a",a/courses.length);
      Session.set("b",b/courses.length);
      Session.set("maxFit",maxFit/courses.length);
      Session.set("minFit",minFit/courses.length);
      Session.set("lwrMin",lwrMin/courses.length);
      Session.set("lwrMax",lwrMax/courses.length);
      Session.set("upprMax",upprMax/courses.length);
      Session.set("upprMin",upprMin/courses.length);
      $(".uline").fadeIn();
    }
  },
  "change .performance-slider"(event, instance) {
    Session.set("performance", instance.$(".performance-slider").val());
  },
  "click .select-all"(event, instance) {
    instance.$(".ccb").prop("checked",true);
    var courses = Courses.find().fetch();
    var a = 0;
    var b = 0;
    var maxFit = 0;
    var minFit = 0;
    var lwrMin = 0;
    var lwrMax = 0;
    var upprMax = 0;
    var upprMin = 0;
    for(var i = 0; i<courses.length; i++) {
      a += courses[i].a;
      b += courses[i].b;
      maxFit += courses[i].maxFit;
      minFit += courses[i].minFit;
      lwrMin += courses[i].lwrMin;
      lwrMax += courses[i].lwrMax;
      upprMax += courses[i].upprMax;
      upprMin += courses[i].upprMin;
    }
    Session.set("a",a/courses.length);
    Session.set("b",b/courses.length);
    Session.set("maxFit",maxFit/courses.length);
    Session.set("minFit",minFit/courses.length);
    Session.set("lwrMin",lwrMin/courses.length);
    Session.set("lwrMax",lwrMax/courses.length);
    Session.set("upprMax",upprMax/courses.length);
    Session.set("upprMin",upprMin/courses.length);
    $(".uline").fadeIn();
    $(".observations").css("fill", "#b0b0b0");
  },
  "click .unselect-all"(event, instance) {
    $(".uline").fadeOut("fast", function() {
      instance.$(".ccb").prop("checked",false);
      Session.set("a",0);
      Session.set("b",0);
      Session.set("maxFit",0);
      Session.set("minFit",0);
      Session.set("lwrMin",0);
      Session.set("lwrMax",0);
      Session.set("upprMax",0);
      Session.set("upprMin",0);
    });
  }
});

Template.regression.onCreated(function bodyOnCreated() {
  var courses = Courses.find().fetch();
  var a = 0;
  var b = 0;
  var maxFit = 0;
  var minFit = 0;
  var lwrMin = 0;
  var lwrMax = 0;
  var upprMax = 0;
  var upprMin = 0;
  for(var i = 0; i<courses.length; i++) {
    a += courses[i].a;
    b += courses[i].b;
    maxFit += courses[i].maxFit;
    minFit += courses[i].minFit;
    lwrMin += courses[i].lwrMin;
    lwrMax += courses[i].lwrMax;
    upprMax += courses[i].upprMax;
    upprMin += courses[i].upprMin;
  }
  Session.set("performance",80);
  Session.set("a",a/courses.length);
  Session.set("b",b/courses.length);
  Session.set("maxFit",maxFit/courses.length);
  Session.set("minFit",minFit/courses.length);
  Session.set("lwrMin",lwrMin/courses.length);
  Session.set("lwrMax",lwrMax/courses.length);
  Session.set("upprMax",upprMax/courses.length);
  Session.set("upprMin",upprMin/courses.length);
});

Template.regression.rendered = function () {
  this.$("#slider").noUiSlider({
    start: [80],
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
    if(val<0) val=0;
    Session.set("performance",val);

  }).on('change', function (ev, val) {
    if(val<0) val=0;
    Session.set("performance",val);
  });
};
