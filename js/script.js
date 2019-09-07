// Variables
var counter = 0, countPause = 1, chosenDifficulty,
    chosenWorkoutType, selectedWorkoutType, runTimer, pullupspermin,
    totalhours, now, ahora, time, tiempo, currentH,
    today, saveDate, saveTime, dateTime, currentM,
    randomNum, randomNumber, minLeft, workoutLog, grabListID,
    fileSaved = "nope", workoutStatus = "waiting", nextInput,
    audioElement    = document.createElement("audio"),
    audioElement2   = document.createElement("audio"),
    site            = window.location.toString(),
    goSound         = function() {
      audioElement.setAttribute("src", "https://michaelsboost.com/Michaels-Workout-App/media/go.mp3");
      audioElement.play();
    },
    breakSound      = function() {
      audioElement.setAttribute("src", "https://michaelsboost.com/Michaels-Workout-App/media/break.mp3");
      audioElement.play();
    },
    errorSound      = function() {
      audioElement.setAttribute("src", "https://michaelsboost.com/Michaels-Workout-App/media/error.mp3");
      audioElement.play();
    },
    abortSound      = function() {
      audioElement.setAttribute("src", "https://michaelsboost.com/Michaels-Workout-App/media/abort.mp3");
      audioElement.play();
    },
    retreatSound    = function() {
      audioElement.setAttribute("src", "https://michaelsboost.com/Michaels-Workout-App/media/retreat.mp3");
      audioElement.play();
    },
    finishedSound   = function() {
      audioElement.setAttribute("src", "https://michaelsboost.com/Michaels-Workout-App/media/complete.mp3");
      audioElement.play();
    },
    newWorkout      = function() {
      // Make sure timer has already been stopped
      clearTimeout(runTimer);
      
      // Reset to no file saved for new workout log
      fileSaved = "nope";
      
      // Reset workout status to waiting
      workoutStatus = "waiting";
      
      // Reset text
      counter = 0;
      countPause = 0;
      totalhours    = howmanyhours.value;
      pullupspermin = repspermin.value;
      $("[data-count=reps]").text(pullupspermin);
      $("[data-countdown=reps]").text(totalhours * 60 * pullupspermin);
      $("[data-count=minutes], [data-output=paused]").text("0");

      // Allow user to reset inputs
      $("[data-action=randomize]").fadeIn(250);
      $("[data-display=typeofworkout]").fadeIn(250);
      $("[data-display=startworkout]").fadeOut(250);
      $("[data-confirm=pauseworkout]").removeClass("hide");
      $("[data-confirm=quitworkout]").removeClass("hide");
      $("[data-confirm=newworkout]").addClass("hide");
      $("[data-save=workoutlog]").addClass("hide");
      $("[data-download=workoutlog]").addClass("hide");
      $("[data-display=finish]").addClass("hide");
      return false;
    },
    scrollToView    = function(el) {
      el.scrollintoview({
        duration: "fast",
        direction: "vertical",
        complete: function() {
          // highlight the element so user's focus gets where it needs to be
        }
      });
    };

// Prevent lity default behavior until how to videos are completed
$("a[data-lity]").on("click", function() {
  alertify.log("coming soon...");
  return false;
});

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

// Randomize Workout
$("[data-action=randomize]").click(function() {
  if ($("[data-display=typeofworkout]").is(":visible")) {
    var array = document.getElementsByName('workoutGroup');
    var randomNumber = Math.floor(Math.random() * 4);

    array[randomNumber].checked = true;

    $("[data-confirm=typeofworkout]").trigger("click");  
  } else {
    randomNum          = Math.floor(Math.random() * 59);
    randomNumber       = Math.floor(Math.random() * 23);
    repspermin.value   = parseInt(1 + randomNum);
    howmanyhours.value = parseInt(1 + randomNumber);
    $("#repspermin").trigger("change");
  }
});

// Trigger check on input if .check symbol clicked
$("[data-display=typeofworkout] ul li .check").on("click", function() {
  grabListID = $(this).prev().prev().attr("id");
  $("[data-display=typeofworkout] #" + grabListID).prop("checked", true).trigger("click");
});

// Global window hotkeys
window.onkeydown = function(e) {
  // Use enter key to confirm type of workout
  if ($("[data-display=typeofworkout]").is(":visible")) {
    if ($("input[name=workoutGroup]").is(":checked")) {
      if (e.keyCode == 13 && e.target == document.body) {
        $("[data-confirm=typeofworkout]").trigger("click");
        return false;
      }
    }
  }
  
  // Workout parameters enter and escape keys
  if ($("[data-display=workoutparameters]").is(":visible")) {
    // Use escape key to go back to workout parameters
    if (e.keyCode == 27 && e.target == document.body) {
      $("[data-confirm=backtoworkout]").trigger("click");
      return false;
    }
    
    // Use enter key to confirm workout parameters
    if (e.keyCode == 13 && e.target == document.body) {
      $("[data-confirm=workoutparameters]").trigger("click");
      return false;
    }
  }
  
  // Workout Start/Pause and Quit hotkeys
  if ($("[data-display=startworkout]").is(":visible")) {
    if ($("[data-confirm=quitworkout]").is(":visible")) {
      // Use escape key to quit workout
      if (e.keyCode == 27 && e.target == document.body) {
        $("[data-confirm=quitworkout]").trigger("click");
        return false;
      }
    }
    
    // Use spacebar to toggle start/pause workout
    if ($("[data-confirm=pauseworkout]").is(":visible")) {
      if (workoutStatus === "running" || workoutStatus === "paused") {
        if (e.keyCode == 32 && e.target == document.body) {
          $("[data-confirm=pauseworkout]").trigger("click");
          return false;
        }
      }
    }
    // Spacebar to initiate a new workout
    if ($("[data-confirm=newworkout]").is(":visible")) {
      // escape key to initiate a new workout
      if (e.keyCode == 27 && e.target == document.body) {
        $("[data-confirm=newworkout]").trigger("click");
        return false;
      }
      // spacebar key to initiate a new workout
      if (e.keyCode == 32 && e.target == document.body) {
        $("[data-confirm=newworkout]").trigger("click");
        return false;
      }
    }
  }
};

// Use up and down arrows to select workout type
shortcut.add("down", function() {
  if ($("[data-display=typeofworkout]").is(":visible")) {
    if ($("input[name=workoutGroup]").is(":checked")) {
      if ($("input[name=workoutGroup]:last").is(":checked")) {
        $("[data-display=typeofworkout] input:first").prop("checked", true).trigger("click");
        
        // Scroll to selected workout
        scrollToView($("[data-display=typeofworkout] input:checked").parent());
      } else {
        nextInput = $("[data-display=typeofworkout] input:checked").parent().next().children().filter("input").attr("id");
        $("[data-display=typeofworkout] #"+ nextInput).prop("checked", true).trigger("click");
        
        // Scroll to selected workout
        scrollToView($("[data-display=typeofworkout] input:checked").parent());
      }
    } else {
      $("[data-display=typeofworkout] input:first").prop("checked", true).trigger("click");

      // Scroll to selected workout
      scrollToView($("[data-display=typeofworkout] input:checked").parent());
    }
  }
  return false;
}, {
  "disable_in_input": true
});
shortcut.add("right", function() {
  if ($("[data-display=typeofworkout]").is(":visible")) {
    if ($("input[name=workoutGroup]").is(":checked")) {
      if ($("input[name=workoutGroup]:last").is(":checked")) {
        $("[data-display=typeofworkout] input:first").prop("checked", true).trigger("click");
        
        // Scroll to selected workout
        scrollToView($("[data-display=typeofworkout] input:checked").parent());
      } else {
        nextInput = $("[data-display=typeofworkout] input:checked").parent().next().children().filter("input").attr("id");
        $("[data-display=typeofworkout] #"+ nextInput).prop("checked", true).trigger("click");
        
        // Scroll to selected workout
        scrollToView($("[data-display=typeofworkout] input:checked").parent());
      }
    } else {
      $("[data-display=typeofworkout] input:first").prop("checked", true).trigger("click");

      // Scroll to selected workout
      scrollToView($("[data-display=typeofworkout] input:checked").parent());
    }
  }
  return false;
}, {
  "disable_in_input": true
});
shortcut.add("up", function() {
  if ($("[data-display=typeofworkout]").is(":visible")) {
    if ($("input[name=workoutGroup]").is(":checked")) {
      if ($("input[name=workoutGroup]:first").is(":checked")) {
        $("[data-display=typeofworkout] input:last").prop("checked", true).trigger("click");
        
        // Scroll to selected workout
        scrollToView($("[data-display=typeofworkout] input:checked").parent());
      } else {
        nextInput = $("[data-display=typeofworkout] input:checked").parent().prev().children().filter("input").attr("id");
        $("[data-display=typeofworkout] #"+ nextInput).prop("checked", true).trigger("click");
        
        // Scroll to selected workout
        scrollToView($("[data-display=typeofworkout] input:checked").parent());
      }
    } else {
      $("[data-display=typeofworkout] input:last").prop("checked", true).trigger("click");

      // Scroll to selected workout
      scrollToView($("[data-display=typeofworkout] input:checked").parent());
    }
  }
  return false;
}, {
  "disable_in_input": true
});
shortcut.add("left", function() {
  if ($("[data-display=typeofworkout]").is(":visible")) {
    if ($("input[name=workoutGroup]").is(":checked")) {
      if ($("input[name=workoutGroup]:first").is(":checked")) {
        $("[data-display=typeofworkout] input:last").prop("checked", true).trigger("click");
        
        // Scroll to selected workout
        scrollToView($("[data-display=typeofworkout] input:checked").parent());
      } else {
        nextInput = $("[data-display=typeofworkout] input:checked").parent().prev().children().filter("input").attr("id");
        $("[data-display=typeofworkout] #"+ nextInput).prop("checked", true).trigger("click");
        
        // Scroll to selected workout
        scrollToView($("[data-display=typeofworkout] input:checked").parent());
      }
    } else {
      $("[data-display=typeofworkout] input:last").prop("checked", true).trigger("click");

      // Scroll to selected workout
      scrollToView($("[data-display=typeofworkout] input:checked").parent());
    }
  }
  return false;
}, {
  "disable_in_input": true
});

// Save workout log hotkey
shortcut.add("ctrl+e", function() {
  if ($("[data-download=workoutlog]").is(":visible")) {
    $("[data-download=workoutlog]").trigger("click");
  }
});
shortcut.add("meta+e", function() {
  if ($("[data-download=workoutlog]").is(":visible")) {
    $("[data-download=workoutlog]").trigger("click");
  }
});

// Share workout log hotkey
shortcut.add("ctrl+s", function() {
  if ($("[data-save=workoutlog]").is(":visible")) {
    $("[data-save=workoutlog]").trigger("click");
  }
});
shortcut.add("meta+s", function() {
  if ($("[data-save=workoutlog]").is(":visible")) {
    $("[data-save=workoutlog]").trigger("click");
  }
});

// Initialize new workout hotkey
shortcut.add("ctrl+n", function() {
  if ($("[data-confirm=newworkout]").is(":visible")) {
    $("[data-confirm=newworkout]").trigger("click");
  }
});

// Back To Type of Workout
$("[data-confirm=backtoworkout]").click(function() {
  $("[data-display=workoutparameters]").fadeOut(250);
  $("[data-display=typeofworkout]").fadeIn(250);
  
  // Remove input focus
  if ($("#repspermin").is(":focus")) {
    repspermin.blur();
  } else {
    if ($("#howmanyhours").is(":focus")) {
      howmanyhours.blur();
    }
  }
});

// Confirm Type of Workout
$("[data-confirm=typeofworkout]").click(function(e) {
  if ( !$("input[name=workoutGroup]").is(":checked") ) {
    alertify.error("No type of workout selected");
  } else {
    $("[data-display=typeofworkout]").fadeOut(250);
    $("[data-display=workoutparameters]").fadeIn(250);
    
    // check if repspermin or howmanyhours already has a value for focus
    if (!repspermin.value) {
      repspermin.focus();
    } else if (!howmanyhours.value) {
      howmanyhours.focus();
    } else {
      repspermin.focus();
    }
    
    chosenWorkoutType = $("[data-display=typeofworkout] input:checked").attr("id");
    selectedWorkoutType = $("[data-display=typeofworkout] label[for="+ chosenWorkoutType +"]").text()
    $("[data-output=workouttype]").text( selectedWorkoutType );
  }
});

// Calculate How Many Hours
$("#repspermin, #howmanyhours").on("keyup change", function() {
  // 4 pullups every min for 2 hours how many pullups?
  // 1 hour = 60mins = 60 × 60secs = 3600secs = 3600 × 1000ms = 3,600,000
  // 60000ms in a minute
  // 60mins in an hour
  
  // This function is called every minute
  // multiply by 4 for hour many pullups per min
  // 4*120 = 480 pullups every min for 2 hours
  
  totalhours    = howmanyhours.value;
  pullupspermin = repspermin.value;
  
  if (repspermin.value && howmanyhours.value) {
    $("[data-confirm=workoutparameters]").show();
    $("[data-calculate=reps], [data-calculate=goal]").text(totalhours * 60 * pullupspermin);
  } else {
    $("[data-confirm=workoutparameters]").hide();
  }
  
  $("[data-count=minutesleft]").text(howmanyhours.value * 60 + " minutes");
  $("[data-calculate=totalmins]").text($("[data-count=minutesleft]").text());
}).on("keydown", function(e) {
  // press escape to go back to type of workout
  if (e.which === 27) {
    $("[data-confirm=backtoworkout]").trigger("click");
  }
  
  // Only if repspermin has value focus on howmanyhours
  if (repspermin.value && !howmanyhours.value) {
    if (e.which === 13) {
      howmanyhours.focus();
    }
  }
  
  // Only if howmanyhours has value focus on repspermin
  if (!repspermin.value && howmanyhours.value) {
    if (e.which === 13) {
      repspermin.focus();
    }
  }
  
  // if both have a valye confirm parameters via enter key
  if (repspermin.value && howmanyhours.value) {
    if (e.which === 13) {
      $("[data-confirm=workoutparameters]").trigger("click");
    }
  }
});

// Start/Stop The Workout
function startWorkout() {
  ahora = new Date();
  tiempo = ahora.toLocaleTimeString();
  $("[data-output=starttime]").text(tiempo);
  
  today = new Date();
  saveDate = today.getMonth() + 1 + ":" + today.getDate() + ":" + today.getFullYear();
  $("[data-output=startdate]").text(saveDate);
  
  $("[data-output=repspermin]").text(repspermin.value);
  if (howmanyhours.value <= "1") {
    $("[data-output=howmanyhours]").text(howmanyhours.value + " hour");
  } else {
    $("[data-output=howmanyhours]").text(howmanyhours.value + " hours");
  }
  
  runTimer = setInterval(function() {
    // Display how many minutes have gone by
    $("[data-count=minutes]").text(counter++);
    minLeft  = $("[data-count=minutes]").text() - 0;
    
    if (minLeft === 1) {
      $("[data-count=minutes]").text(minLeft + " minute has");
      $("[data-count=minutesleft]").text(howmanyhours.value * 60 - minLeft + " minute");
    } else {
      $("[data-count=minutes]").text(minLeft + " minutes have");
      $("[data-count=minutesleft]").text(howmanyhours.value * 60 - minLeft + " minutes");
    }
    
    // Count how many reps
    $("[data-count=reps]").text(parseInt(repspermin.value * counter - repspermin.value));
    
    // Count how many reps left to do
    $("[data-countdown=reps]").text(parseInt($("[data-calculate=reps]").text() - $("[data-count=reps]").text()));
    
    // Let the user know every minute when to execute workout
    goSound();

    // Workout completed
    if (counter > howmanyhours.value * 60) {
      $("[data-display=finish]").removeClass("hide");
      $("[data-confirm=newworkout]").removeClass("hide");
      $("[data-save=workoutlog]").removeClass("hide");
      $("[data-download=workoutlog]").removeClass("hide");
      $("[data-confirm=quitworkout]").addClass("hide");
      $("[data-confirm=pauseworkout]").addClass("hide");
      $("[data-output=finish]").text(time);
      clearTimeout(runTimer);
      finishedSound();
    }
  }, 60000);
}
function abortWorkout() {
  countPause = 1;
  workoutStatus = "waiting";
  $("[data-display=break]").html("&nbsp;");
  $("[data-action=randomize]").fadeIn(250);
  clearTimeout(runTimer);
  abortSound();
}

// Define a function to display the current time
function displayTime() {
  now = new Date();
  time = now.toLocaleTimeString();
  clock.textContent = time;
  setTimeout(displayTime, 1000);
}
displayTime();

// Start The Workout
$("[data-confirm=workoutparameters]").click(function() {
  workoutStatus = "running";
  counter = 1;
  
  totalhours    = howmanyhours.value;
  pullupspermin = repspermin.value;
  $("[data-display=workoutparameters]").fadeOut(250);
  $("[data-action=randomize]").fadeOut(250);
  $("[data-display=startworkout]").fadeIn(250);
  $("[data-countdown=reps]").text(totalhours * 60 * pullupspermin);
  $("[data-count=minutes]").text("0 minutes have");
  $("[data-count=reps]").text("0");
  startWorkout();
  goSound();
});

// Abort The Workout
$("[data-confirm=quitworkout]").click(function() {
  Swal.fire({
    title: 'Are you sure?',
    text: "You will have to start all over!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Quit Workout!'
  }).then((result) => {
    if (result.value) {
      $("[data-confirm=pauseworkout]").text("Pause Workout");
      $("[data-display=finish]").removeClass("hide");
      $("[data-confirm=newworkout]").removeClass("hide");
      $("[data-save=workoutlog]").removeClass("hide");
      $("[data-download=workoutlog]").removeClass("hide");
      $(this).addClass("hide");
      $("[data-confirm=pauseworkout]").addClass("hide");
      $("[data-output=finish]").text(time);
      clearTimeout(runTimer);
      abortWorkout();
    }
  });
});

// Pause Workout
$("[data-confirm=pauseworkout]").click(function() {
  if (workoutStatus === "running") {
    workoutStatus = "paused";
    
    this.textContent = "Resume Workout";
    clearTimeout(runTimer);
    runTimer = 0;
    breakSound();
    $("[data-output=paused]").text(countPause++);
    $("[data-display=break]").html("On Break<br><br>");
    return false;
  } else {
    workoutStatus = "running";

    this.textContent = "Pause Workout";
    runTimer = 0;
    startWorkout();
    $("[data-display=break]").html("&nbsp;");
    return false;
  }
});

// Workout Finished Initiate New Workout
$("[data-confirm=newworkout]").click(function() {
  // Detect if user saved workout or not
  if (fileSaved === "saved") {
    newWorkout();
  } else {
    Swal.fire({
      title: "You haven't saved your workout!",
      text: "Irreversable! We will not be able to recover this workout log. Are you sure you want to lose this workout log?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        newWorkout();
      }
    });
  }
});

// Save Workout Log As File
$("[data-save=workoutlog]").click(function() {
  // User is saving workout log
  // Updating variable so user isn't prompted upon new workout
  fileSaved = "saved";
  
  today = new Date();
  saveDate = today.getMonth() + 1 + "_" + today.getDate() + "_" + today.getFullYear();
  dateTime = saveDate + " " + $("[data-output=finish]").text();
  
  workoutLog = $("[data-content=workoutlog]").text().trim().replace(/\s{2,}/gm,"\n").toString();
  blob = new Blob([ workoutLog ], {type: "text/plain"});
  saveAs(blob, "workout_log " + dateTime + ".txt");
});

// Share Workout Log To The Web
$("[data-download=workoutlog]").click(function() {
  workoutLog = $("[data-content=workoutlog]").text().trim().replace(/\s{2,}/gm,"\n").toString();
  workoutLog = workoutLog.replace(/\n/g,"\\n");
  workoutLog = workoutLog.replace(/ /g,"%20");

//  var link = document.createElement('a');
//  link.href = "file:///Users/michael/Documents/GitHub/Michaels-Workout-App/downloadlog.html#" + workoutLog;
//  link.href = "https://michaelsboost.com/Michaels-Workout-App/downloadlog.html#" + workoutLog;
//  link.setAttribute('target', '_blank');
//  link.click();
  
  // check if preview already exists
  if ($("#preview").is(":visible")) {
    $("#preview").remove();
  }
  
  // update site variable
  if (site.substring(0, site.indexOf('index.html'))) {
    site = site.replace(/index.html/g, "downloadlog.html");
  } else {
    site = site + "downloadlog.html";
  }
  
  // initialize preview to download image
  var frame = document.createElement("iframe");
  frame.setAttribute("id", "preview");
  frame.setAttribute("src", site + "#" + workoutLog);
  frame.setAttribute("sandbox", "allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-downloads-without-user-activation");
  document.body.appendChild(frame);
  return false;
});

// Animate button on click
$("[data-action=bounce]").on("click", function() {
  doBounce($(this), 2, '15px', 50);   
  return false;
});
function doBounce(element, times, distance, speed) {
  for(i = 0; i < times; i++) {
    element.animate({marginTop: '-='+distance},speed)
           .animate({marginTop: '+='+distance},speed);
  }        
}

// Auto open how to video
//$("[data-display=typeofworkout] a:first").trigger("click");

// Auto Fill Bot Test
//$("[data-display=typeofworkout] #pushups").prop("checked", true).trigger("click");
//$("[data-confirm=typeofworkout]").trigger("click");
//repspermin.value = 17;
//$("#howmanyhours").val(".25").trigger("change");
//$("[data-confirm=workoutparameters]").trigger("click");
