// Variables
var str, startTime,
    testString = "Date: 9:6:2019\nStart time: 3:10:57 PM\nObjective: 17 pushups a minute for 1 hour\nGoal: 1020 pushups in 1 hour\nCompleted: 1020 pushups\n60 minutes have gone by\n0 pushups remaining\n0 minutes remaining\nTimes Paused: 0\nFinished at: 4:10:56 PM",
    site         = window.location,
    openInNewTab = function(url) {
      var a = document.createElement("a");
      a.target = "_blank";
      a.href = url;
      a.click();
    };

// Disclaimer
$("[data-action=disclaimer]").click(function() {
  var msg1 = "I Michael Schwartz developed this workout app for myself and myself only!\n\n",
      msg2 = "I am not held liable if you do any of the workouts listed in this app!\n\n",
      msg3 = "By using this app you agree that you're doing these workouts by your own discression only!<br><br>",
      msg4 = "Contribution and Source Code: <br><a href='https://github.com/michaelsboost/Michaels-Workout-App/' target='_blank'>https://github.com/michaelsboost/Michaels-Workout-App/</a>";
      
  Swal.fire({
    title: "Disclaimer",
    html: msg1 + msg2 + msg3 + msg4,
    type: "warning"
  });
});

// Check if page has a hash
if (window.location.hash) {
  // Detect if domain is HTTP
  site = site.toString();
  if (site.substring(0, 7) === "http://") {
    // domain is http
    site = "http%3A//" + site.substring(7, site.length);
  } else if (site.substring(0, 8) === "https://") {
    // domain is https
    site = "https%3A//" + site.substring(8, site.length);
  } else {
    // cannot detect http encoding revert to Polyrise domain as default
    site = "https%3A//michaelsboost.github.io/Michaels-Workout-App/share/" + window.location.hash;
  }
  
  // Grab the hash
  str = window.location.hash;
  str = str.substr(1, str.length);
  str = str.replace(/%20/g, " ");
  
  startTime = str.substring(0, str.indexOf('\\n'));
  startTime = startTime.replace(/Date: /g, "");
  document.title = "Shared Workout Log: " + startTime;

  // Display in workout log
  $("[data-output=workoutlog]").html(str.replace(/\\n/g, "<br>"));
} else {
  // No hash? Then initialize new workout
//  window.location.href = "./index.html";
}

// Share This Workout
$("[data-shareTo]").on("click", function() {
  var thisAttr = $(this).attr("data-shareTo").toLowerCase();
  
  if (thisAttr === "facebook") {
    openInNewTab("https://www.facebook.com/sharer/sharer.php?u=" + site);
  } else if (thisAttr === "twitter") {
    openInNewTab("https://twitter.com/home?status=" + site);
  } else if (thisAttr === "googleplus") {
    openInNewTab("https://plus.google.com/share?url=" + site);
  } else if (thisAttr === "linkedin") {
    openInNewTab("https://www.linkedin.com/shareArticle?mini=true&url=" + site + "&title=&summary=&source=");
  } else {
    alertify.error("Unable to share, undetected social network");
  }
});

// Animate button on click
$("[data-action=bounce]").on("click", function() {
  doBounce($(this), 2, '15px', 50);
});
function doBounce(element, times, distance, speed) {
  for(i = 0; i < times; i++) {
    element.animate({marginTop: '-='+distance},speed)
           .animate({marginTop: '+='+distance},speed);
  }        
}