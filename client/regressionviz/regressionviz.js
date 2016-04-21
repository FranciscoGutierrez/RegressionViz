/*Publish - subscribe */
Courses  = new Meteor.Collection('courses');
Grades   = new Meteor.Collection('studentscourses');
Meteor.subscribe("this_courses");
/*Publish - subscribe */

Session.setDefault("a", 1);
Session.setDefault("b", 1);
Session.setDefault("p", 1);
Session.setDefault("performance", 80);
Session.setDefault("lwrMin",1);
Session.setDefault("lwrMax",1);
Session.setDefault("upprMax",1);
Session.setDefault("upprMin",1);

Template.regression.helpers({
  regressionLine() {
    var a = Session.get("a");
    var b = Session.get("b");
    var y1 = 400-(a/20)*400;
    var y2 = 400-((b+a)/20)*400;
    var lwrMin = Session.get("lwrMin");
    var lwrMax = Session.get("lwrMax");
    var upprMax = Session.get("upprMax");
    var upprMin = Session.get("upprMin");
    var ratioUpr1 = (((upprMin-a)/5)/20)*400;
    var ratioUpr2 = (((upprMax-(b+a))/5)/20)*400;
    /* Middle */
    var ratioLwr1 = (((a-lwrMin)/5)/20)*400;
    var ratioLwr2 = ((((b+a)-lwrMax)/5)/20)*400;
    return {
      y1:y1,
      y2:y2,
      a1:y1,
      a2:y2,
      ra1:y1-ratioUpr1,
      ra2:y2-ratioUpr2,
      b1:y1-ratioUpr1,
      b2:y2-ratioUpr2,
      rb1:y1-(ratioUpr1*2),
      rb2:y2-(ratioUpr2*2),
      c1:y1-(ratioUpr1*2),
      c2:y2-(ratioUpr2*2),
      rc1:y1-(ratioUpr1*3),
      rc2:y2-(ratioUpr2*3),
      d1:y1-(ratioUpr1*3),
      d2:y2-(ratioUpr2*3),
      rd1:y1-(ratioUpr1*4),
      rd2:y2-(ratioUpr2*4),
      e1:y1-(ratioUpr1*4),
      e2:y2-(ratioUpr2*4),
      re1:y1-(ratioUpr1*5),
      re2:y2-(ratioUpr2*5),
      aa1:y1,
      aa2:y2,
      raa1:y1+ratioLwr1,
      raa2:y2+ratioLwr2,
      bb1:y1+ratioLwr1,
      bb2:y2+ratioLwr2,
      rbb1:y1+(ratioLwr1*2),
      rbb2:y2+(ratioLwr2*2),
      cc1:y1+(ratioLwr1*2),
      cc2:y2+(ratioLwr2*2),
      rcc1:y1+(ratioLwr1*3),
      rcc2:y2+(ratioLwr2*3),
      dd1:y1+(ratioLwr1*3),
      dd2:y2+(ratioLwr2*3),
      rdd1:y1+(ratioLwr1*4),
      rdd2:y2+(ratioLwr2*4),
      ee1:y1+(ratioLwr1*4),
      ee2:y2+(ratioLwr2*4),
      ree1:y1+(ratioLwr1*5),
      ree2:y2+(ratioLwr2*5)
    };
  },
  courses() {
    return Courses.find({},{sort: {name: 1}});
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
    var a = Session.get("a");
    var b = Session.get("b");
    var lwrMin = Session.get("lwrMin");
    var lwrMax = Session.get("lwrMax");
    var upprMax = Session.get("upprMax");
    var upprMin = Session.get("upprMin");

    var courses = $('input:checkbox:checked').map(function () {
      return this.value;
    }).get();

    if (courses.length > 11) {
      var y1 = 100-(a/20)*100;
      var y2 = 100-((b+a)/20)*100;
      var dd1 = y1+((((a-lwrMin)/5)/20)*100)*4;
      var dd2 = y2+(((((a+b)-lwrMax)/5)/20)*100)*4;
      for (var i = 0; i<120; i++) {
        var x = (Math.random()*100).toFixed(1);
        var z = x/100 + _.random(0, 100-y2)/100;
        arr.push({x:x, y:100-(((a + (b * z))/20)*100)});
      }
      for (var i = 0; i<200; i++) {
        var x = (Math.random()*100).toFixed(1);
        var z = x/100 + _.random(-10, 10)/100;
        arr.push({x:x, y:100-(((a + (b * z))/20)*100)});
      }
      for (var i = 0; i<120; i++) {
        var x = (Math.random()*100).toFixed(1);
        var z = x/100 + _.random(0, (-1)*dd2)/100;
        arr.push({x:x, y:100-(((a + (b * z))/20)*100)});
      }
    }
    else {
      var selected = Grades.find({ "code":{ $in: courses  }}).fetch();
      for(var i = 0; i<selected.length; i++) {
        arr.push({ x : (selected[i].performance * 100).toFixed(1), y: 100-((selected[i].score/20)  * 100)});
      }
    }
    // console.log(arr);
    return arr;
  },
  details() {
    var maxFit  = Session.get("maxFit");
    var minFit  = Session.get("minFit");
    var lwrMin  = Session.get("lwrMin");
    var lwrMax  = Session.get("lwrMax");
    var upprMax = Session.get("upprMax");
    var upprMin = Session.get("upprMin");
    var prediction = parseFloat(Session.get("p"));
    var p = parseFloat(Session.get("performance"));
    var u = (upprMin+((upprMax-upprMin)*(p/100))).toFixed(1);
    var l = (lwrMin +((lwrMax-lwrMin)*(p/100))).toFixed(1);

    var lwr = Session.get("lwr");
    var upr = Session.get("upr");
    var ratioUpr = (((upr - prediction)/5)/20)*100;
    var ratioLwr = (((prediction - lwr)/5)/20)*100;

    if(u > 20) u = 20;
    if(l < 0)  l = 0;
    var g = ((prediction+4.91)-10)*10;
    var r = (7-(prediction-4.91))*10;
    if(g<0) g = 0;
    var y = 100-(g+r);
    Session.set("lwr",l);
    Session.set("upr",u);
    return {
      lwr: l,
      upr: u,
      red: r,
      yellow: y,
      green:  g,
      ua1: ratioLwr*4,
      ua2: ratioLwr*4,
      ua3: ratioLwr*4,
      ua4: ratioLwr*4,
      ua5: ratioLwr*4,
      ua6: (ratioUpr/2)*4, // Center... purple..
      ua7: ratioUpr*4,
      ua8: ratioUpr*4,
      ua9: ratioUpr*4,
      ua10: ratioUpr*4,
      ua11: ratioUpr*4
    };
  },
  size() {
    return Session.get("size");
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
      Session.set("a",0);
      Session.set("b",0);
      Session.set("maxFit",0);
      Session.set("minFit",0);
      Session.set("lwrMin",0);
      Session.set("lwrMax",0);
      Session.set("upprMax",0);
      Session.set("upprMin",0);
    } else {
      var courses = Courses.find({ "_id":{ $in: arr  }}).fetch();
      if (arr.length < 11) Meteor.subscribe("grades", arr);
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
    $(".observations").css("fill", "#b0b0b0");
  },
  "click .unselect-all"(event, instance) {
    instance.$(".ccb").prop("checked",false);
    Session.set("a",0);
    Session.set("b",0);
    Session.set("maxFit",0);
    Session.set("minFit",0);
    Session.set("lwrMin",0);
    Session.set("lwrMax",0);
    Session.set("upprMax",0);
    Session.set("upprMin",0);
  },
  "mouseenter .performance-explain"(event, instance) {
      $(".explained").fadeIn();
  },
  "mouseleave .performance-explain"(event, instance) {
      $(".explained").fadeOut();
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
    Session.get("upr");
    Session.get("p");
    Session.get("lwr");
    var size = _.random(6, 6);
    $(".ua5:lt("+size+")").css("opacity","1");
    /******/
    Session.set("size", size);
  }).on('change', function (ev, val) {
    if(val<0) val=0;
    Session.set("performance",val);
  });
};
