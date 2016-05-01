Courses  = new Meteor.Collection('courses');
Grades   = new Meteor.Collection('studentscourses');
Students = new Meteor.Collection('students');

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
    var arr = [];
    var filter = Grades.find({fase:"eerste fase", academischeperiode: "Tweede Semester"}).fetch();
    for(var i=0; i<filter.length; i++){
      arr.push(filter[i].code);
    }
    var courses = Courses.find({_id: {$in:arr}},{sort: {name: 1}}).fetch();
    var p = Session.get("performance")/100;
    for(var i=0; i<courses.length; i++) {
      courses[i].pnow = (courses[i].a + (courses[i].b * p)).toFixed(1);
      courses[i].difficulty = Math.round(courses[i].difficulty * 10);
      if(courses[i].pnow<=0) courses[i].pnow = 0;
    }
    return courses
  },
  failed() {
    var fase = Session.get("failFase");
    var text = "eerste fase";
    if(fase==1) text = "eerste fase";
    if(fase==2) text = "tweede fase";
    if(fase==3) text = "derde fase";
    return Grades.find({student: Number(Session.get("student")), fase:text, score: { $lt : 10 }}).fetch();
  },
  passed() {
    var fase = Session.get("passFase");
    var text = "eerste fase";
    if(fase==1) text = "eerste fase";
    if(fase==2) text = "tweede fase";
    if(fase==3) text = "derde fase";
    return Grades.find({student:Number(Session.get("student")), fase:text, score:{$gte:10}}).fetch();
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
  details() {
    var maxFit  = Session.get("maxFit");
    var minFit  = Session.get("minFit");
    var lwrMin  = Session.get("lwrMin");
    var lwrMax  = Session.get("lwrMax");
    var upprMax = Session.get("upprMax");
    var upprMin = Session.get("upprMin");
    var pre = parseFloat(Session.get("p"));
    var lwr = Session.get("lwr");
    var upr = Session.get("upr");

    var p = parseFloat(Session.get("performance"));
    var u = (upprMin+((upprMax-upprMin)*(p/100))).toFixed(1);
    var l = (lwrMin +((lwrMax-lwrMin)*(p/100))).toFixed(1);

    var ratioUpr = (((u - pre)/5)/20)*100;
    var ratioLwr = (((pre - l)/5)/20)*100;

    Session.set("lwr",l);
    Session.set("upr",u);

    var a1 = u;
    var a2 = ((pre+((u-pre)/5)*4)).toFixed(1);
    var a3 = ((pre+((u-pre)/5)*3)).toFixed(1);
    var a4 = ((pre+((u-pre)/5)*2)).toFixed(1);
    var a5 = (pre+(u-pre)/5).toFixed(1);
    var a6 = pre;
    var a7 = (pre-((pre-l)/5)).toFixed(1);
    var a8 = (pre-((pre-l)/5)*2).toFixed(1);
    var a9 = (pre-((pre-l)/5)*3).toFixed(1);
    var a10 = (pre-((pre-l)/5)*4).toFixed(1);
    var a11 = l;

    return {
      ua1: (a11<=0) ? a11 = 0 : a11,
      ac1: (a11>=10) ? "0f9d58" : (a11<=8) ? "e74c3c": "f39c12",
      ua2: (a10<=0) ? a10 = 0 : a10,
      ac2: (a10>=10) ? "0f9d58" : (a10<=8) ? "e74c3c": "f39c12",
      ua3: (a9<=0) ? a9 = 0 : a9,
      ac3: (a9>=10) ? "0f9d58" : (a9<=8) ? "e74c3c": "f39c12",
      ua4: (a8<=0) ? a8 = 0 : a8,
      ac4: (a8>=10) ? "0f9d58" : (a8<=8) ? "e74c3c": "f39c12",
      ua5: (a7<=0) ? a7 = 0 : a7,
      ac5: (a7>=10) ? "0f9d58" : (a7<=8) ? "e74c3c": "f39c12",
      ua6: (a6<=0) ? a6 = 0 : a6, // Center... purple..
      ac6: (a6>=10) ? "0f9d58" : (a6<=8) ? "e74c3c": "f39c12",
      ua7: (a5<=0) ? a5 = 0 : a5,
      ac7: (a5>=10) ? "0f9d58" : (a5<=8) ? "e74c3c": "f39c12",
      ua8: (a4<=0) ? a4 = 0 : a4,
      ac8: (a4>=10) ? "0f9d58" : (a4<=8) ? "e74c3c": "f39c12",
      ua9: (a3<=0) ? a3 = 0 : a3,
      ac9: (a3>=10) ? "0f9d58" : (a3<=8) ? "e74c3c": "f39c12",
      ua10:(a2<=0) ? a2 = 0 : a2,
      ac10:(a2>=10) ? "0f9d58" : (a2<=8) ? "e74c3c": "f39c12",
      ua11:(a1<=0) ? a1 = 0 : a1,
      ac11:(a1>=10) ? "0f9d58" : (a1<=8) ? "e74c3c": "f39c12",
      pred:pre
    };
  },
  size() {
    return Session.get("size");
  },
  image(){
    var arr = [];
    var a = Session.get("a");
    var courses = $('paper-checkbox[checked]').each(function() {
      arr.push({ name : $(this).attr("value") });
    });
    console.log(arr);
    return arr;
  },
  overalldetails() {
    var arr = [];
    var a = Session.get("a");
    var odhour = 0;
    var odcred = 0;
    var odcourse = 0;
    var courses = $('paper-checkbox[checked]').each(function() {
      odhour   = Courses.findOne({_id:$(this).attr("value")}).hours + odhour;
      odcred   = Courses.findOne({_id:$(this).attr("value")}).credits + odcred;
      odcourse = odcourse + 1;
    }).get();
    if(courses.length <= 0) {
      $(".right-column-container").fadeOut();
    } else {
      $(".right-column-container").fadeIn();
    }
    return {
      odcred: odcred,
      odcourse: odcourse,
      odhour: odhour
    };
  }
});

Template.regression.events({
  "click .course"(event, instance) {
    // instance.$("#cb-"+this._id).prop("checked", !instance.$("#cb-"+this._id).prop("checked"));
    $(".observations").css("fill", "#b0b0b0");
    var arr = [];
    var courses = $('paper-checkbox[checked]').each(function() {
      arr.push($(this).attr("value"));
    });
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
  "click .adjust-value"(event, instance) {
    instance.$("#slider").fadeIn();
    instance.$(".adjust-value").text("reset");
    instance.$(".adjust-value").addClass("reset-value");
    instance.$(".chance-sub").text("Based in your custom selection.");
  },
  "click .reset-value"(event, instance) {
    instance.$("#slider").fadeOut();
    instance.$(".adjust-value").text("adjust");
    instance.$(".chance-sub").text("Based in your score records.");
    instance.$(".adjust-value").removeClass("reset-value");
    Session.set("performance", (Students.findOne().performance/20)*100);
    instance.$("#slider").val(Session.get("performance"));
  },
  "click .p-fase1"(event, instance) {
    Session.set("passFase",1);
    instance.$(".p-fase3").removeClass("fase-selected");
    instance.$(".p-fase2").removeClass("fase-selected");
    instance.$(".p-fase1").addClass("fase-selected");
  },
  "click .p-fase2"(event, instance) {
    Session.set("passFase",2);
    instance.$(".p-fase1").removeClass("fase-selected");
    instance.$(".p-fase3").removeClass("fase-selected");
    instance.$(".p-fase2").addClass("fase-selected");
  },
  "click .p-fase3"(event, instance) {
    Session.set("passFase",3);
    instance.$(".p-fase1").removeClass("fase-selected");
    instance.$(".p-fase2").removeClass("fase-selected");
    instance.$(".p-fase3").addClass("fase-selected");
  },
  "click .f-fase1"(event, instance) {
    Session.set("failFase",1);
    instance.$(".f-fase3").removeClass("fase-selected");
    instance.$(".f-fase2").removeClass("fase-selected");
    instance.$(".f-fase1").addClass("fase-selected");
  },
  "click .f-fase2"(event, instance) {
    Session.set("failFase",2);
    instance.$(".f-fase1").removeClass("fase-selected");
    instance.$(".f-fase3").removeClass("fase-selected");
    instance.$(".f-fase2").addClass("fase-selected");
  },
  "click .f-fase3"(event, instance) {
    Session.set("failFase",3);
    instance.$(".f-fase1").removeClass("fase-selected");
    instance.$(".f-fase2").removeClass("fase-selected");
    instance.$(".f-fase3").addClass("fase-selected");
  }
  // "mouseenter .available-list"(event, instance) {
  //   instance.$(".course-tooltip").fadeIn();
  // },
  // "mouseleave .available-list"(event, instance) {
  //   instance.$(".course-tooltip").fadeOut();
  // }
});

Template.regression.rendered = function () {
  this.$("#slider").noUiSlider({
    start: [Session.get("performance").toFixed(0)],
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
  });
};
