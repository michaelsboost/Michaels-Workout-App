// Variables
var counter = 0, countPause = 1, chosenDifficulty, unsupportedBrowser,
    chosenWorkoutType, selectedWorkoutType, runTimer, now, ahora,
    time, tiempo, currentH, today, saveDate, saveTime, dateTime, currentM,
    randomNum, randomNumber, minLeft, workoutLog, grabListID,
    fileSaved = "nope", workoutStatus = "waiting", nextInput,
    isFirefox, isChrome, isSafari, isOpera, isIE, isEdge, isBlink,
    audioElement     = document.createElement("audio"),
    audioElement2    = document.createElement("audio"),
    grablog          = document.querySelector(".grablog"),
    site             = window.location.toString(),
    goSound          = function() {
      audioElement.setAttribute("src", "https://michaelsboost.com/Michaels-Workout-App/media/go.mp3");
      audioElement.play();
    },
    breakSound       = function() {
      audioElement.setAttribute("src", "https://michaelsboost.com/Michaels-Workout-App/media/break.mp3");
      audioElement.play();
    },
    errorSound       = function() {
      audioElement.setAttribute("src", "https://michaelsboost.com/Michaels-Workout-App/media/error.mp3");
      audioElement.play();
    },
    abortSound       = function() {
      audioElement.setAttribute("src", "https://michaelsboost.com/Michaels-Workout-App/media/abort.mp3");
      audioElement.play();
    },
    retreatSound     = function() {
      audioElement.setAttribute("src", "https://michaelsboost.com/Michaels-Workout-App/media/retreat.mp3");
      audioElement.play();
    },
    finishedSound    = function() {
      audioElement.setAttribute("src", "https://michaelsboost.com/Michaels-Workout-App/media/complete.mp3");
      audioElement.play();
    },
    finishWorkout    = function() {
      $("[data-display=finish]").removeClass("hide");
      $("[data-confirm=newworkout]").removeClass("hide");
      $("[data-save=workoutlog]").removeClass("hide");
      $("[data-download=workoutlog]").removeClass("hide");
      $("[data-confirm=quitworkout]").addClass("hide");
      $("[data-confirm=pauseworkout]").addClass("hide");
      $("[data-count=minutesleft]").text("0 minutes");
      $("[data-output=finish]").text(time);
      clearTimeout(runTimer);
      finishedSound();
    },
    scrollToView     = function(el) {
      el.scrollintoview({
        duration: "fast",
        direction: "vertical",
        complete: function() {
          // highlight the element so user's focus gets where it needs to be
        }
      });
    },
    openInNewTab     = function(url) {
      str = $("[data-content=workoutlog]").text().trim().replace(/\s{2,}/gm,"<br>").toString();

      startTime = str.substring(0, str.indexOf('\\n'));
      first = str.indexOf('\\n');
      next  = str.indexOf('\\n', first + 1);
      dateTime  = startTime.replace(/Date: /g, "");
      startTime = str.substring(str.indexOf('Finished at: '));
      startTime = startTime.replace(/Finished at: /g, "");
      
      today = new Date();
      saveDate = today.getMonth() + 1 + "_" + today.getDate() + "_" + today.getFullYear();
      dateTime = saveDate + " " + $("[data-output=finish]").text().replace(/:/g, "_");

      var a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      // a.download = "workout_log " + dateTime + " " + startTime;
      a.click();
    },
    detectWebBrowser = function() {
      unsupportedBrowser = '<ul style="margin-top: 1em;"><li class="ib" style="width: 50%;"><h1 class="ib"><a class="block" href="https://www.google.com/chrome/" target="_blank"><i class="fa fa-chrome"></i><div>Chrome</div></a></h1></li><li class="ib" style="width: 50%;"><h1 class="ib"><a class="block" href="https://www.mozilla.org/" target="_blank"><i class="fa fa-firefox"></i><div>Firefox</div></a></h1></li><li class="ib" style="width: 50%;"><h1 class="ib"><a class="block" href="https://www.opera.com/" target="_blank"><i class="fa fa-opera"></i><div>Opera</div></a></h1></li><li class="ib" style="width: 50%;"><h1 class="ib"><a class="block" href="https://www.microsoftedgeinsider.com/en-us/download/" target="_blank"><i class="fa fa-edge"></i><div>Edge</div></a></h1></li></ul>';
      if (platform.name === "Chrome" || platform.name === "Chrome Mobile" || platform.name === "Firefox" || platform.name === "Firefox for iOS" || platform.name === "Opera" || platform.name === "Microsoft Edge") {
        // supported browsers
      } else {
        Swal.fire({
          title: "Unsupported Web Browser!",
          html: "You are using an unsupported web browser.<br>We recommend using one of these...<br><br>" + unsupportedBrowser,
          type: "warning"
        });
      }
    };

// Always start view from stop
window.scrollTo(0, 0);

// Alert the user if using an unsupported browser
// detectWebBrowser();

// Disclaimer
$("[data-action=disclaimer]").click(function() {
  var msg1 = "I Michael Schwartz developed this workout app for myself and myself only!\n\n",
      msg2 = "I am not held liable if you do any of the workouts listed in this app!\n\n",
      msg3 = "By using this app you agree that you're doing these workouts by your own discression only!<br><br>",
      msg4 = "Contribution and Source Code: <br><a href=\"https://github.com/michaelsboost/Michaels-Workout-App/\" target=\"_blank\">https://github.com/michaelsboost/Michaels-Workout-App/</a><br>",
      msg5 = "<a href=\"https://play.google.com/store/apps/details?id=com.michael.workoutapp&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1\" target=\"_blank\" title=\"Get it on Google Play\"><img src=\"https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png\" style=\"margin: 0 0 -20px 0;\"></a>";

  Swal.fire({
    title: "Disclaimer",
    html: msg1 + msg2 + msg3 + msg4 + msg5,
    type: "warning"
  });
});

// Only play video if there's an internet connection
$("a[data-lity]").on("click", function() {
  if (!navigator.onLine) {
    alertify.error("Can't play video: No internet connection!'");
    return false;
  }

  if ($(this).attr("data-check") === "comingsoon") {
    alertify.log("coming soon...");
    return false;
  }
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

    $("#howmanyhours").trigger("change");
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
  
  if (repspermin.value && howmanyhours.value) {
    $("[data-confirm=workoutparameters]").show();

    if ($("[data-set=min]").text() === "min") {
      $("[data-calculate=reps], [data-calculate=goal]").text(howmanyhours.value * 60 * repspermin.value);
    } else if ($("[data-set=min]").text() === "30 sec") {
      $("[data-calculate=reps], [data-calculate=goal]").text(howmanyhours.value * 2 * 60 * repspermin.value);
    } else if ($("[data-set=min]").text() === "45 sec") {
      $("[data-calculate=reps], [data-calculate=goal]").text(howmanyhours.value * 60 * 1.5 * repspermin.value);
    }
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

// Change between 1 min/30 sec/45 sec intervals
$("[data-set=min]").click(function() {
  if (this.textContent === "min") {
    // then 30 sec
    this.textContent = "30 sec";
    $(this).attr("data-interval", "30000");
    repspermin.setAttribute("placeholder", "Reps per 30 seconds");
    $("[data-output=minorsec]").text("every 30 seconds for");
    $(".selectdropdowns ul li:first-child input[type=number]").css("width", "calc(100% - 139.9px)");
  } else if (this.textContent === "30 sec") {
    // if 30 sec then 45 sec
    this.textContent = "45 sec";
    $(this).attr("data-interval", "45000");
    repspermin.setAttribute("placeholder", "Reps per 45 seconds");
    $("[data-output=minorsec]").text("every 45 seconds for");
    $(".selectdropdowns ul li:first-child input[type=number]").css("width", "calc(100% - 139.9px)");
  } else {
    // if 45 sec then 1 min
    this.textContent = "min";
    $(this).attr("data-interval", "60000");
    repspermin.setAttribute("placeholder", "Reps per minute");
    $("[data-output=minorsec]").text("a minute for");
    $(".selectdropdowns ul li:first-child input[type=number]").css("width", "calc(100% - 118.9px)");
  }
  $("#repspermin, #howmanyhours").trigger("change");
}).click();

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
    console.log(minLeft);
    
    // Countdown reps
    if (minLeft === 1) {
      if ($("[data-set=min]").text() === "min") {
        $("[data-count=minutes]").text(minLeft + " minute has");
        $("[data-count=minutesleft]").text(howmanyhours.value * 60 - minLeft + " minutes");
      } else if ($("[data-set=min]").text() === "30 sec") {
        $("[data-count=minutes]").text(parseInt(30).toString() * minLeft + " seconds have");

        // 1 minute remaining
        $("[data-count=minutesleft]").text(howmanyhours.value * 60 - minLeft / 2 + " minutes");
        if ($("[data-count=minutesleft]").text() === "1 minutes") {
          $("[data-count=minutesleft]").text("1 minute");
        }
      } else if ($("[data-set=min]").text() === "45 sec") {
        $("[data-count=minutes]").text("45 seconds have");
        $("[data-count=minutesleft]").text(Math.round(howmanyhours.value * 60 - minLeft / 1.5) + " minutes");
      }
    } else {
      if ($("[data-set=min]").text() === "min") {
        $("[data-count=minutes]").text(minLeft + " minutes have");
        $("[data-count=minutesleft]").text(howmanyhours.value * 60 - minLeft + " minutes");
        
      } else if ($("[data-set=min]").text() === "30 sec") {
        // 1 minute has gone by
        if (parseInt(30).toString() * minLeft / 60 === 1) {
          $("[data-count=minutes]").text(parseInt(30).toString() * minLeft / 60 + " minute has");
        } else {
          $("[data-count=minutes]").text(parseInt(30).toString() * minLeft / 60 + " minutes have");
        }
        
        // 1 minute remaining
        $("[data-count=minutesleft]").text(howmanyhours.value * 60 - minLeft / 2 + " minutes");
        if ($("[data-count=minutesleft]").text() === "1 minutes") {
          $("[data-count=minutesleft]").text("1 minute");
        } else if ($("[data-count=minutesleft]").text() === "0.5 minutes") {
          $("[data-count=minutesleft]").text("0.5 minute");
        }
        
      } else if ($("[data-set=min]").text() === "45 sec") {
        $("[data-count=minutes]").text(parseInt(45).toString() * minLeft + " seconds have");
        $("[data-count=minutesleft]").text(Math.round(howmanyhours.value * 60 - minLeft / 1.5) + " minutes");
      }
    }

    // Count how many reps
    $("[data-count=reps]").text(Math.round(parseInt(repspermin.value * counter - repspermin.value)));

    // Count how many reps left to do
    $("[data-countdown=reps]").text(Math.round(parseInt($("[data-calculate=reps]").text() - $("[data-count=reps]").text())));

    // Let the user know every minute when to execute workout
    goSound();

    // Workout completed
    if ($("[data-set=min]").text() === "min") {
      if (counter > howmanyhours.value * 60) {
        finishWorkout();
      }
    } else if ($("[data-set=min]").text() === "30 sec") {
      if (counter / 2 > howmanyhours.value * 60) {
        finishWorkout();
      }
    } else if ($("[data-set=min]").text() === "45 sec") {
      if (counter / 1.75 > howmanyhours.value * 60) {
        finishWorkout();
      }
    }
//  }, $("[data-set=min]").attr("data-interval"));
  }, 3000);
}
function abortWorkout() {
  countPause = 1;
  workoutStatus = "waiting";
  $("[data-display=break]").html("&nbsp;");
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
    
  if (howmanyhours.value.substr(0, 1) === ".") {
    howmanyhours.value = "0" + howmanyhours.value;
  }
  
  $("[data-display=workoutparameters]").fadeOut(250);
  $("[data-action=randomize]").fadeOut(250);
  $("[data-display=startworkout]").fadeIn(250);

  // Countdown reps
  if ($("[data-set=min]").text() === "min") {
    $("[data-countdown=reps]").text(howmanyhours.value * 60 * repspermin.value);
  } else if ($("[data-set=min]").text() === "30 sec") {
    $("[data-countdown=reps]").text(howmanyhours.value * 2 * 60 * repspermin.value);
  } else if ($("[data-set=min]").text() === "45 sec") {
    $("[data-countdown=reps]").text(Math.round(howmanyhours.value * 1.5 * 60 * repspermin.value));
  }
  
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
    window.scrollTo(0, 0);
    location.reload(true);
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
        window.scrollTo(0, 0);
        location.reload(true);
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
  dateTime = saveDate + " " + $("[data-output=finish]").text().replace(/:/g, "_");;

  workoutLog = $("[data-content=workoutlog]").text().trim().replace(/\s{2,}/gm,"\n").toString();
  workoutLog = workoutLog + "\n\nTry a workout at: https://michaelsboost.com/workout";
  blob = new Blob([ workoutLog ], {type: "text/plain"});
  saveAs(blob, "workout_log " + dateTime + ".txt");
});

// Download Workout Log As Image
$("[data-download=workoutlog]").click(function() {
  // User is saving workout log
  // Updating variable so user isn't prompted upon new workout
  fileSaved = "saved";
  
  workoutLog = $("[data-content=workoutlog]").text().trim().replace(/\s{2,}/gm,"\n").toString();
  workoutLog = workoutLog.replace(/\n/g,"\\n");
  workoutLog = workoutLog.replace(/ /g,"%20");
  
  // check if preview already exists
  if ($("#preview").is(":visible")) {
    $("#preview").remove();
  }
  
  // update site variable
  site = window.location.toString();
  if (site.substring(0, site.indexOf('index.html'))) {
    site = site.replace(/index.html/g, "downloadlog.html");
  } else if (site.substring(0, site.indexOf('downloadlog.html'))) {
    // leave it's fine
  } else {
    site = site + "downloadlog.html";
  }
  
  // initialize preview to download image
  var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  if (iOS === true) {
    openInNewTab(site + "#" + workoutLog);
  } else {
    var frame = document.createElement("iframe");
    frame.setAttribute("id", "preview");
    frame.setAttribute("src", site + "#" + workoutLog);
    frame.setAttribute("sandbox", "allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-downloads-without-user-activation");
    document.body.appendChild(frame);
  }
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
//repspermin.value = 2;
//$("#howmanyhours").val(".05").trigger("change");
//$("[data-set=min]").trigger("click").trigger("click");
//$("[data-confirm=workoutparameters]").trigger("click");
