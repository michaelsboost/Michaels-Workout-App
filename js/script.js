// Variables
var counter = 1, chosenDifficulty, chosenWorkoutType, runTimer,
  pullupspermin, totalhours, time, currentH, currentM, randomNum, randomNumber,
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

// Workout Finished Initiate New Workout
$("[data-confirm=newworkout]").click(function() {
//  location.reload(true);

  // Reset text
  counter = 0;
  totalhours    = $("#howmanyhours").val();
  pullupspermin = $("#repspermin").val();
  $("[data-count=reps]").text(pullupspermin);
  $("[data-countdown=reps]").text(totalhours * 60 * pullupspermin);
  $("[data-count=minutes]").text("0");

  // Allow user to reset inputs
  $("[data-action=randomize]").fadeIn(250);
  $("[data-display=typeofworkout]").fadeIn(250);
  $("[data-display=startworkout]").fadeOut(250);
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
    $("[data-calculate=reps]").text(totalhours * 60 * pullupspermin);
  } else {
    $("[data-confirm=workoutparameters]").hide();
  }
});

// Start/Stop The Workout
function startWorkout() {
  var ahora = new Date();
  tiempo = ahora.toLocaleTimeString();
  $("[data-output=starttime]").text(tiempo);
  $("[data-output=repspermin]").text(repspermin.value);
  if (howmanyhours.value === "1") {
    $("[data-output=howmanyhours]").text(howmanyhours.value + " hour");
  } else {
    $("[data-output=howmanyhours]").text(howmanyhours.value + " hours");
  }
  
  runTimer = setInterval(function() {
    $("[data-count=minutes]").text(counter++);
    $("[data-count=reps]").text(parseInt($("#repspermin").val() * counter));
    $("[data-countdown=reps]").text(parseInt($("[data-calculate=reps]").text() - $("[data-count=reps]").text()));
    goSound();

    if ($("[data-countdown=reps]").text() === "0") {
      $("[data-confirm=newworkout]").removeClass("hide");
      $("[data-confirm=stopworkout]").addClass("hide");
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
  var now = new Date();
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
  $("[data-count=minutes]").text("0");
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
    $("[data-display=workoutparameters]").fadeIn(250);
    $("[data-display=startworkout]").fadeOut(250);
  })
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

// Auto Select
$("[data-display=typeofworkout] #pullups").prop("checked", true).trigger("click");
$("[data-confirm=typeofworkout]").trigger("click");
$("#repspermin").val("4");
$("#howmanyhours").val("1").trigger("change");
$("[data-confirm=workoutparameters]").trigger("click");
