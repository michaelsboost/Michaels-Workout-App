// Variables
var str, startTime, imageURL, first, next,
    testString = "Date: 9:6:2019\nStart time: 3:10:57 PM\nObjective: 17 pushups a minute for 1 hour\nGoal: 1020 pushups in 1 hour\nCompleted: 1020 pushups\n60 minutes have gone by\n0 pushups remaining\n0 minutes remaining\nTimes Paused: 0\nFinished at: 4:10:56 PM",
    grablog      = document.querySelector(".grablog"),
    site         = window.location;

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
    // cannot detect http encoding revert to domain as default
    site = window.location + "downloadlog.html" + window.location.hash;
  }
  
  // Grab the hash
  str = window.location.hash;
  str = str.substr(1, str.length);
  str = str.replace(/%20/g, " ");
  
  startTime = str.substring(0, str.indexOf('\\n'));
  startTime = startTime.replace(/Date: /g, "");
  document.title = "Download Workout Log: " + startTime;

  // Display in workout log
  workoutLog = str.replace(/\\n/g, "\n");
  $("[data-output=workoutlog]").html(workoutLog + "\n\nTry a workout at:\nhttps://michaelsboost.com/workout");
  
  // grab date and time for file name
  str = window.location.hash;
  str = str.substr(1, str.length);
  str = str.replace(/%20/g, " ");

  startTime = str.substring(0, str.indexOf('\\n'));
  first = str.indexOf('\\n');
  next  = str.indexOf('\\n', first + 1);
  dateTime  = startTime.replace(/Date: /g, "");
  startTime = str.substring(str.indexOf('Finished at: '));
  startTime  = startTime.replace(/Finished at: /g, "");
  
  // Scroll to top
  window.scrollTo(0, 0);
  
  // convert website to image
  html2canvas(grablog).then(function(canvas) {
    // download canvas image
    myBase64 = canvas.toDataURL("image/png");
    var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    if (iOS === true) {
      // remove image if already visible
      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.id = "getshot";
      img.src = myBase64;
      document.body.appendChild(img);

      var a = document.createElement("a");
      a.href = getshot.src;
      a.download = "workout_log " + dateTime + " " + startTime + ".png";
      a.click();
      document.body.removeChild(img);
    } else {
      canvas.toBlob(function(blob) {
        saveAs(blob, "workout_log " + dateTime + " " + startTime + ".png");
      }, "image/png");
    }
  });
} else {
  // No hash? Then initialize new workout
  // window.location.href = "./index.html";
}

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