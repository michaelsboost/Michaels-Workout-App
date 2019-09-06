// Variables
var counter = 1, countPause = 1, chosenDifficulty,
    chosenWorkoutType, runTimer, pullupspermin,
    totalhours, now, ahora, time, tiempo, currentH,
    today, saveDate, saveTime, dateTime, currentM,
    randomNum, randomNumber, minLeft, minsLeft, workoutLog,
    fileSaved = "nope",
    audioElement     = document.createElement("audio"),
    audioElement2    = document.createElement("audio"),
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
    newWorkout       = function() {
      // Make sure timer has already been stopped
      clearTimeout(runTimer);
      
      // Reset to no file saved for new workout log
      fileSaved = "nope";
      
      // Reset text
      counter = 0;
      countPause = 0;
      totalhours    = $("#howmanyhours").val();
      pullupspermin = $("#repspermin").val();
      $("[data-count=reps]").text(pullupspermin);
      $("[data-countdown=reps]").text(totalhours * 60 * pullupspermin);
      $("[data-count=minutes], [data-output=paused]").text("0");

      // Allow user to reset inputs
      $("[data-action=randomize]").fadeIn(250);
      $("[data-display=typeofworkout]").fadeIn(250);
      $("[data-display=startworkout]").fadeOut(250);
      $("[data-confirm=pauseworkout]").removeClass("hide");
      $("[data-confirm=stopworkout]").removeClass("hide");
      $("[data-confirm=newworkout]").addClass("hide");
      $("[data-save=workoutlog]").addClass("hide");
      $("[data-display=finish]").addClass("hide");
    };

// Disclaimer
$("[data-action=disclaimer]").click(function() {
  var msg1 = "I Michael Schwartz developed this workout app for myself and myself only!\n\n",
      msg2 = "I am not held liable if you do any of the workouts listed in this app!\n\n",
      msg3 = "By using this app you agree that you're doing these workouts by your own discression only!";
      
  swal({
    title: "Disclaimer",
    text: msg1 + msg2 + msg3,
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

// Back To Workout Parameters
$("[data-confirm=backtoworkout]").click(function() {
  $("[data-display=workoutparameters]").fadeOut(250);
  $("[data-display=typeofworkout]").fadeIn(250);
});

// Confirm Type of Workout
$("[data-confirm=typeofworkout]").click(function() {
  if ( !$("input[name=workoutGroup]").is(":checked") ) {
    alertify.error("No type of workout selected");
  } else {
    $("[data-display=typeofworkout]").fadeOut(250);
    $("[data-display=workoutparameters]").fadeIn(250);
    
    chosenWorkoutType = $("[data-display=typeofworkout] input:checked").attr("id");
    $("[data-output=workouttype]").text( $("[data-display=typeofworkout] label[for="+ chosenWorkoutType +"]").text() );
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
  
  totalhours    = $("#howmanyhours").val();
  pullupspermin = $("#repspermin").val();
  
  if ($("#repspermin").val() && $("#howmanyhours").val()) {
    $("[data-confirm=workoutparameters]").show();
    $("[data-calculate=reps], [data-calculate=goal]").text(totalhours * 60 * pullupspermin);
  } else {
    $("[data-confirm=workoutparameters]").hide();
  }
  
  $("[data-count=minutesleft]").text($("#howmanyhours").val() * 60 - 1 + " minutes");
});

// Start workout by pressing enter key on workout parameters (if has a value)
$("#repspermin, #howmanyhours").on("keydown", function(e) {
  if ($("#repspermin").val() && $("#howmanyhours").val()) {
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
  $("[data-output=repspermin]").text(repspermin.value);
  if (howmanyhours.value <= "1") {
    $("[data-output=howmanyhours]").text(howmanyhours.value + " hour");
  } else {
    $("[data-output=howmanyhours]").text(howmanyhours.value + " hours");
  }
  
  runTimer = setInterval(function() {
    // Display how many minutes have gone by
    $("[data-count=minutes]").text(counter++);
    minLeft = $("[data-count=minutes]").text();
    minsLeft = $("[data-count=minutes]").text();
    
    if (minLeft === "1") {
      $("[data-count=minutes]").text(minLeft + " minute has");
    } else {
      $("[data-count=minutes]").text(minLeft + " minutes have");
    }
    
    // Display minutes left
    if (minsLeft === "58") {
      $("[data-count=minutesleft]").text($("#howmanyhours").val() * 60 - 1 - minsLeft + " minute");
    } else {
      $("[data-count=minutesleft]").text($("#howmanyhours").val() * 60 - 1 - minsLeft + " minutes");
    }
    
    // Count how many reps
    $("[data-count=reps]").text(parseInt($("#repspermin").val() * counter));
    
    // Count how many reps left to do
    $("[data-countdown=reps]").text(parseInt($("[data-calculate=reps]").text() - $("[data-count=reps]").text()));
    
    // Let the user know every minute when to execute workout
    goSound();

    // Workout completed
    if ($("[data-countdown=reps]").text() === "0") {
      $("[data-display=finish]").removeClass("hide");
      $("[data-confirm=newworkout]").removeClass("hide");
      $("[data-save=workoutlog]").removeClass("hide");
      $("[data-confirm=stopworkout]").addClass("hide");
      $("[data-confirm=pauseworkout]").addClass("hide");
      $("[data-output=finish]").text(time);
      clearTimeout(runTimer);
      finishedSound();
    }
  }, 60000);
}
function abortWorkout() {
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
  totalhours    = $("#howmanyhours").val();
  pullupspermin = $("#repspermin").val();
  $("[data-count=reps]").text(pullupspermin);
  $("[data-display=workoutparameters]").fadeOut(250);
  $("[data-action=randomize]").fadeOut(250);
  $("[data-display=startworkout]").fadeIn(250);
  $("[data-countdown=reps]").text(totalhours * 60 * pullupspermin);
  $("[data-count=minutes]").text("0 minutes have");
  startWorkout();
  goSound();
});

// Abort The Workout
$("[data-confirm=stopworkout]").click(function() {
  swal({
    title: 'Are you sure?',
    text: "You will have to start all over!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Quit Workout!'
  }).then(function() {
    abortWorkout();
    
    // Reset text
    counter = 0;
    countPause = 0;
    totalhours    = $("#howmanyhours").val();
    pullupspermin = $("#repspermin").val();
    $("[data-count=reps]").text(pullupspermin);
    $("[data-countdown=reps]").text(totalhours * 60 * pullupspermin);
    $("[data-count=minutes], [data-output=paused]").text("0");

    // Allow user to reset inputs
    $("[data-action=randomize]").fadeIn(250);
    $("[data-display=typeofworkout]").fadeIn(250);
    $("[data-display=startworkout]").fadeOut(250);
    $("[data-confirm=pauseworkout]").removeClass("hide");
    $("[data-confirm=stopworkout]").removeClass("hide");
    $("[data-confirm=newworkout]").addClass("hide");
    $("[data-display=finish]").addClass("hide");
  });
});

// Pause Workout
$("[data-confirm=pauseworkout]").click(function() {
  if ($("[data-confirm=stopworkout]").is(":visible")) {
    this.textContent = "Start Workout";
    $("[data-confirm=stopworkout]").addClass("hide");
    clearTimeout(runTimer);
    runTimer = 0;
    breakSound();
    $("[data-output=paused]").text(countPause++);
  } else {
    this.textContent = "Pause Workout";
    $("[data-confirm=stopworkout]").removeClass("hide");
    runTimer = 0;
    startWorkout();
  }
});

// Workout Finished Initiate New Workout
$("[data-confirm=newworkout]").click(function() {
  // Detect if user saved workout or not
  if (fileSaved === "saved") {
    newWorkout();
  } else {
    swal({
      title: "You haven't saved your workout!",
      text: "Irreversable! We will not be able to recover this workout log. Are you sure you want to lose this workout log?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then(function() {
      newWorkout();
    });
  }
});

// Workout Finished Initiate New Workout
$("[data-save=workoutlog]").click(function() {
  // User is saving workout log
  // Updating variable so user isn't prompted upon new workout
  fileSaved = "saved";
  
  today = new Date();
  saveDate = today.getMonth() + 1 + "_" + today.getDate() + "_" + today.getFullYear();
  dateTime = saveDate + " " + $("[data-output=finish]").text();
  
  workoutLog = $("[data-content=workoutlog]").text().trim().replace(/[\s]/g," ").replace(/\s{2,}/gm,"\n").toString();
  blob = new Blob([ workoutLog ], {type: "text/plain"});
  saveAs(blob, "workout_log " + dateTime + ".txt");
});

// Animate button on click
$("[data-confirm=typeofworkout], [data-confirm=workoutparameters], [data-confirm=stopworkout]").on("click", function() {
  doBounce($(this), 2, '15px', 50);   
  return false;
});
function doBounce(element, times, distance, speed) {
  for(i = 0; i < times; i++) {
    element.animate({marginTop: '-='+distance},speed)
           .animate({marginTop: '+='+distance},speed);
  }        
}

// Auto Fill Bot Test
//$("[data-display=typeofworkout] #pushups").prop("checked", true).trigger("click");
//$("[data-confirm=typeofworkout]").trigger("click");
//$("#repspermin").val("17");
//$("#howmanyhours").val("1").trigger("change");
//$("[data-confirm=workoutparameters]").trigger("click");
