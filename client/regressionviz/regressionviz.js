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
    var lwrMin = Session.get("lwrMin");
    var lwrMax = Session.get("lwrMax");
    var upprMax = Session.get("upprMax");
    var upprMin = Session.get("upprMin");
    if(a) {
      y1 = 100-(a/20)*100;
      y2 = 100-((b+a)/20)*100;
    }
    return {
      y1: y1,
      y2: y2,
      a1: y1+(((a-upprMin)/5)/20)*100,
      a2: y2+((((a+b)-upprMax)/5)/20)*100,
      b1: y1+((((a-upprMin)/5)/20)*100)*2,
      b2: y2+(((((a+b)-upprMax)/5)/20)*100)*2,
      c1: y1+((((a-upprMin)/5)/20)*100)*3,
      c2: y2+(((((a+b)-upprMax)/5)/20)*100)*3,
      d1: y1+((((a-upprMin)/5)/20)*100)*4,
      d2: y2+(((((a+b)-upprMax)/5)/20)*100)*4,
      e1: 100-(lwrMin/20)*100,
      e2: 100-(lwrMax/20)*100,
      aa1: y1+(((a-lwrMin)/5)/20)*100,
      aa2: y2+((((a+b)-lwrMax)/5)/20)*100,
      bb1: y1+((((a-lwrMin)/5)/20)*100)*2,
      bb2: y2+(((((a+b)-lwrMax)/5)/20)*100)*2,
      cc1: y1+((((a-lwrMin)/5)/20)*100)*3,
      cc2: y2+(((((a+b)-lwrMax)/5)/20)*100)*3,
      dd1: y1+((((a-lwrMin)/5)/20)*100)*4,
      dd2: y2+(((((a+b)-lwrMax)/5)/20)*100)*4,
      ee1: 100-(upprMin/20)*100,
      ee2: 100-(upprMax/20)*100,
      ratiolwr: Math.abs((((a-lwrMax)/5)/20)*100),
      ratioupr: Math.abs((((a-upprMax)/5)/20)*100)
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
    var a = Session.get("a");
    var b = Session.get("b");

    var lwrMin = Session.get("lwrMin");
    var lwrMax = Session.get("lwrMax");
    var upprMax = Session.get("upprMax");
    var upprMin = Session.get("upprMin");

    var y1 = 100-(a/20)*100;
    var y2 = 100-((b+a)/20)*100;
    var a1 = y1+(((a-upprMin)/5)/20)*100;
    var a2 = y2+((((a+b)-upprMax)/5)/20)*100;
    var b1 = y1+((((a-upprMin)/5)/20)*100)*2;
    var b2 = y2+(((((a+b)-upprMax)/5)/20)*100)*2;
    var c1 = y1+((((a-upprMin)/5)/20)*100)*3;
    var c2 = y2+(((((a+b)-upprMax)/5)/20)*100)*3;
    var d1 = y1+((((a-upprMin)/5)/20)*100)*4;
    var d2 = y2+(((((a+b)-upprMax)/5)/20)*100)*4;
    var e1 = 100-(lwrMin/20)*100;
    var e2 = 100-(lwrMax/20)*100;
    var aa1 = y1+(((a-lwrMin)/5)/20)*100;
    var aa2 = y2+((((a+b)-lwrMax)/5)/20)*100;
    var bb1 = y1+((((a-lwrMin)/5)/20)*100)*2;
    var bb2 = y2+(((((a+b)-lwrMax)/5)/20)*100)*2;
    var cc1 = y1+((((a-lwrMin)/5)/20)*100)*3;
    var cc2 = y2+(((((a+b)-lwrMax)/5)/20)*100)*3;
    var dd1 = y1+((((a-lwrMin)/5)/20)*100)*4;
    var dd2 = y2+(((((a+b)-lwrMax)/5)/20)*100)*4;
    var ee1 = 100-(upprMin/20)*100;
    var ee2 = 100-(upprMax/20)*100;


    for (var i = 0; i<10; i++) {
      var x = (Math.random()*100).toFixed(1);
      var y = (Math.random()*100).toFixed(1);
      arr.push({x:x, y:y});
    }

    for (var i = 0; i<200; i++) {
      var x = (Math.random()*100).toFixed(1);
      var z = x/100 + _.random(0, 10)/100;
      var r = a + (b * z);
      arr.push({x:x, y:100-((r/20)*100)});
    }

    for (var i = 0; i<100; i++) {
      var x = (Math.random()*100).toFixed(1);
      var z = x/100 + _.random(10,20)/100;
      var r = a + (b * z);
      arr.push({x:x, y:100-((r/20)*100)});
    }

    for (var i = 0; i<50; i++) {
      var x = (Math.random()*100).toFixed(1);
      var z = x/100 + _.random(20, 30)/100;
      var r = a + (b * z);
      arr.push({x:x, y:100-((r/20)*100)});
    }

    for (var i = 0; i<25; i++) {
      var x = (Math.random()*100).toFixed(1);
      var z = x/100 + _.random(30, 40)/100;
      var r = a + (b * z);
      arr.push({x:x, y:100-((r/20)*100)});
    }


    for (var i = 0; i<200; i++) {
      var x = (Math.random()*100).toFixed(1);
      var z = x/100 + _.random(0, -10)/100;
      var r = a + (b * z);
      arr.push({x:x, y:100-((r/20)*100)});
    }

    for (var i = 0; i<100; i++) {
      var x = (Math.random()*100).toFixed(1);
      var z = x/100 + _.random(-10,-20)/100;
      var r = a + (b * z);
      arr.push({x:x, y:100-((r/20)*100)});
    }

    for (var i = 0; i<50; i++) {
      var x = (Math.random()*100).toFixed(1);
      var z = x/100 + _.random(-20, -30)/100;
      var r = a + (b * z);
      arr.push({x:x, y:100-((r/20)*100)});
    }

    for (var i = 0; i<25; i++) {
      var x = (Math.random()*100).toFixed(1);
      var z = x/100 + _.random(-30, -40)/100;
      var r = a + (b * z);
      arr.push({x:x, y:100-((r/20)*100)});
    }

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
    var u = (upprMin+((upprMax-upprMin)*(p/100))).toFixed(2);
    var l = (lwrMin +((lwrMax-lwrMin)*(p/100))).toFixed(2);

    var lwr = Session.get("lwr");
    var upr = Session.get("upr");
    var ratioUpr = Math.abs((((prediction - upr)/5)/20)*100);
    var ratioLwr = Math.abs((((prediction - lwr)/5)/20)*100);

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
      green:g,
      ua1: ratioUpr*5,
      ua2: ratioUpr*4,
      ua3: ratioUpr*3,
      ua4: ratioUpr*2,
      ua5: ratioUpr+ratioLwr,
      ua6: ratioLwr*2,
      ua7: ratioLwr*3,
      ua8: ratioLwr*4,
      ua9: ratioLwr*5
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
    var size = _.random(2, 5);
    $(".udot").css("opacity","0");
    $(".ua1:lt("+_.random(0, 2)+")").css("opacity","1");
    $(".ua2:lt("+_.random(1, 2)+")").css("opacity","1");
    $(".ua3:lt("+_.random(1, 4)+")").css("opacity","1");
    $(".ua4:lt("+_.random(1, 4)+")").css("opacity","1");

    $(".ua5:lt("+size+")").css("opacity","1");
    Session.set("size", size);
    $(".ua6:lt("+_.random(1, 4)+")").css("opacity","1");
    $(".ua7:lt("+_.random(1, 4)+")").css("opacity","1");
    $(".ua8:lt("+_.random(1, 2)+")").css("opacity","1");
    $(".ua9:lt("+_.random(0, 2)+")").css("opacity","1");

  }).on('change', function (ev, val) {
    if(val<0) val=0;
    Session.set("performance",val);
  });
};
