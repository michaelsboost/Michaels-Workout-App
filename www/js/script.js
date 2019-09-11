// Variables
var counter = 0, countPause = 1, chosenDifficulty,
    chosenWorkoutType, selectedWorkoutType, runTimer, now, 
    ahora, time, tiempo, currentH, today, saveDate, saveTime, dateTime,
    currentM, randomNum, randomNumber, minLeft, workoutLog, grabListID,
    fileSaved = "nope", workoutStatus = "waiting", nextInput,
    audioElement    = document.createElement("audio"),
    audioElement2   = document.createElement("audio"),
    grablog         = document.querySelector(".grablog"),
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
    scrollToView    = function(el) {
      el.scrollintoview({
        duration: "fast",
        direction: "vertical",
        complete: function() {
          // highlight the element so user's focus gets where it needs to be
        }
      });
    },
    saveFile        = function(fileData, fileName) {
      // if cordova.file is not available use instead :
      // var folderpath = "file:///storage/emulated/0/";
      var folderpath = cordova.file.externalRootDirectory;

      // Get access to the file system
      window.resolveLocalFileSystemURL(folderpath, function(fileSystem) {
        // Create the file.
        fileSystem.getFile(fileName, {create: true, exclusive: false}, function(entry) {
          // After you save the file, you can access it with this URL
          myFileUrl = entry.toURL();
          entry.createWriter(function(writer) {
            writer.onwriteend = function(evt) {
              alert("Successfully saved file to " + myFileUrl);
            };
            // Write to the file
            writer.write(fileData);
          }, function(error) {
            alert("Error: Could not create file writer, " + error.code);
          });
        }, function(error) {
          alert("Error: Could not create file, " + error.code);
        });
      }, function(evt) {
        alert("Error: Could not access file system, " + evt.target.error.code);
      });
    };

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

/**
 * Create a Image file according to its database64 content only.
 * 
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
 */
function savebase64AsImageFile(filename,content,contentType) {
  // Convert the base64 string in a Blob
  var DataBlob = b64toBlob(content,contentType);

  // Starting to write the file

  // if cordova.file is not available use instead :
  // var folderpath = "file:///storage/emulated/0/";
  var folderpath = cordova.file.externalRootDirectory;
  window.resolveLocalFileSystemURL(folderpath, function(dir) {
    // Access to the directory granted succesfully
    dir.getFile(filename, {create: true, exclusive: false}, function(file) {
      // After you save the file, you can access it with this URL
      myFileUrl = file.toURL();
      // File created succesfully
      file.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function(evt) {
          alert("Successfully saved file to " + myFileUrl);
        };
        // Writing content to file
        fileWriter.write(DataBlob);
      }, function(){
        alert('Unable to save file in path '+ folderpath);
      });
    });
  });
}

// Always start view from stop
window.scrollTo(0, 0);

// Check if Android Device is Ready
function deviceReady() {
  // Disclaimer
  $("[data-action=disclaimer]").click(function() {
    var msg1 = "I Michael Schwartz developed this workout app for myself and myself only!\n\n",
        msg2 = "I am not held liable if you do any of the workouts listed in this app!\n\n",
        msg3 = "By using this app you agree that you're doing these workouts by your own discression only!<br><br>",
        msg4 = "Contribution and Source Code: <br><a href=\"javascript:window.open('https://github.com/michaelsboost/Michaels-Workout-App/', '_system')\">https://github.com/michaelsboost/Michaels-Workout-App/</a>";

    Swal.fire({
      title: "Disclaimer",
      html: msg1 + msg2 + msg3 + msg4,
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
  
  // open all links in default web browser
  $("a[target=_blank]").on("click", function() {
    window.open(this.href, '_system');
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
      $("[data-calculate=reps], [data-calculate=goal]").text(howmanyhours.value * 60 * repspermin.value);
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
    $("[data-countdown=reps]").text(howmanyhours.value * 60 * repspermin.value);
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
    saveFile(blob, "workout_log " + dateTime + ".txt");
  });

  // Download Workout Log As Image
  $("[data-download=workoutlog]").click(function() {
    window.scrollTo(0, 0);
    
    // User is saving workout log
    // Updating variable so user isn't prompted upon new workout
    fileSaved = "saved";
    
    workoutLog = $("[data-content=workoutlog]").text().trim().replace(/\s{2,}/gm,"<br>").toString();
    workoutLog = workoutLog + "<br><br>Try a workout at:<br>https://michaelsboost.com/workout";
    $("[data-output=workoutlog]").html(workoutLog);

    // convert website to image
    html2canvas(grablog).then(function(canvas) {
      /** Process the type1 base64 string **/
//      var myBase64 = canvas.toDataURL();
      var myBase64 = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      
      // Split the base64 string in data and contentType
      var block = myBase64.split(";");
      // Get the content type
      var dataType = block[0].split(":")[1]; // In this case "image/png"
      // get the real base64 content of the file
      var realData = block[1].split(",")[1]; // In this case "iVBORw0KGg...."

      today = new Date();
      saveDate = today.getMonth() + 1 + "_" + today.getDate() + "_" + today.getFullYear();
      dateTime = saveDate + " " + $("[data-output=finish]").text().replace(/:/g, "_");;
      
      // To define the type of the Blob
      var filename = "workout_log " + dateTime + ".png";
      
      savebase64AsImageFile(filename,realData,dataType);
    });
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
};
//document.addEventListener("DOMContentLoaded", deviceReady, false);
document.addEventListener("deviceready", deviceReady, false);
