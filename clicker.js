var points = 1; //total amount of corgis
var multiplier = 1; //multiplier for cost/corgi gains
var cost = 40; //start cost for click upgrade
var autoClickCost = 200; //start cost for autoclick upgrade
var autoClickMultiplier = 0; //amount added in autoAdder
var randomEventExecuted = 0;

function load() { //load all variables with localstorage
  if(localStorage.getItem("savedCorgis") !== null) { // if never played before don't load anything, this is to avoid NaN errors
    var storedCorgis = localStorage.getItem("savedCorgis");
    var storedMultipliers = localStorage.getItem("savedMultiplier");
    var storedCosts = localStorage.getItem("savedCosts");
    var storedAutoClickCost = localStorage.getItem("savedAutoClickCost");
    var storedAutoClickMultiplier = localStorage.getItem("savedAutoClickMultiplier");
    var storedRandomEventExecuted = localStorage.getItem("savedRandomEventExecuted");

    //load all the variables into the game, this is called during load (automatic for the user)
    points = parseInt(storedCorgis); //parseInt as all variables are ints
    if (points <= 1) { //corgi (singular) if one, corgis (plural) if more than one
      document.getElementById("pointsDisplay").innerHTML = points + " corgi"; //updates the text
    } else {
      document.getElementById("pointsDisplay").innerHTML = points + " corgis"; //updates the text
    }

    multiplier = parseInt(storedMultipliers);
    cost = parseInt(storedCosts);
    document.getElementById("upgradeButton").innerHTML = "UPGRADE<br/>" + cost;

    autoClickCost = parseInt(storedAutoClickCost);
    document.getElementById("autoClickButton").innerHTML = "AUTOCLICK<br/>" + autoClickCost;

    autoClickMultiplier = parseInt(storedAutoClickMultiplier);
    randomEventExecuted = parseInt(storedRandomEventExecuted);

    document.getElementById("CPS").innerHTML = autoClickMultiplier + " corgis per second"

    //run previous upgrades/settings
    autoUpdateTitle();

    if (randomEventExecuted != 0) { //run random events if clicked once before
      randomEvent();
    }

    if (autoClickMultiplier != 0) {
      autoAdder();
    }
  }


}


function save() { //save all variables, happens on unload (automatic for the user)
  localStorage.setItem("savedCorgis", points);
  localStorage.setItem("savedMultiplier", multiplier);
  localStorage.setItem("savedCosts", cost);
  localStorage.setItem("savedAutoClickCost", autoClickCost);
  localStorage.setItem("savedAutoClickMultiplier", autoClickMultiplier);
  localStorage.setItem("savedRandomEventExecuted", randomEventExecuted);
}

function updateClickCount() { //click the corgi
  points += multiplier; //adds to your total amount of corgis based on multiplier
  points = Math.round(points) //no decimals
  document.getElementById("pointsDisplay").innerHTML = points + " corgis"; //updates the text

  //make it possible to get random events, runs only once (no random events until you actually click the corgi once)
  if (randomEventExecuted === 0) {
    randomEvent();
    randomEventExecuted += 1;
    autoUpdateTitle(); //starts updating title after first click
  }
}

function upgradeClick() { //upgrade manual click button
  if (points >= cost) { //if enough corgis are present
    points -= cost; //reduce total corgis with cost
    points = Math.round(points) //round up, in case.
    multiplier += 1; //increase the multiplier for increased corgis per click
    document.getElementById("pointsDisplay").innerHTML = points + " corgis";
    document.title = points + " corgis - Corgi Clicker";
    cost = cost * 4; //increase cost
    document.getElementById("upgradeButton").innerHTML = "UPGRADE<br/>" + cost;
  } else {
    document.getElementById("pointsDisplay").innerHTML = "Not enough corgis!";
  }
}

function autoClick() { //button for calling autoAdder, increase cost/multiplier
  if (points >= autoClickCost) { //checks if there's enough corgis to purchase
    points -= autoClickCost; //reduce the total corgis
    points = Math.round(points) //round up, just in case
    document.getElementById("pointsDisplay").innerHTML = points + " corgis";
    document.title = points + " corgis - Corgi Clicker";
    autoClickCost = autoClickCost * 2;
    autoClickCost = Math.round(autoClickCost)
    autoClickMultiplier += 1;
    document.getElementById("autoClickButton").innerHTML = "AUTOCLICK<br/>" + autoClickCost;
    document.getElementById("CPS").innerHTML = autoClickMultiplier + " corgis per second"
    autoAdder();
  } else {
    document.getElementById("pointsDisplay").innerHTML = "Not enough corgis!";
  }
}

function autoAdder() { //actual autoclicker
  points = Math.round(points) //rounding up
  setInterval(function() { //adds corgis every 1000 ms, updates text for each new corgi
    points += autoClickMultiplier;
  }, 1000);
}

function autoUpdateTitle() { //updates the title/corgis of the site every second
  setInterval(function() {
    document.title = points + " corgis - Corgi Clicker";
    document.getElementById("pointsDisplay").innerHTML = points + " corgis";
  }, 1000);
}

function debugButton() { //resets the game, for debugging but could be a feature for eventual future users
  points = 1;
  multiplier = 1;
  cost = 40;
  autoClickCost = 200;
  autoClickMultiplier = 0;
  randomEventExecuted = 0;
  document.getElementById("pointsDisplay").innerHTML = points + " corgis";
}

function cheat() { //cheat for eventual debugging, will obviously be removed if launched
  points += 100000;
}

function randomEvent() { //this function makes it so that random events can happen
  var randomTime = (Math.random() * 40000000) + 20000; //random event happens every 20 + 0-40 seconds
  setInterval(function() { //sets said interval for the interval event
    points += 10 * (multiplier + 1) * (autoClickMultiplier + 1); //more bonus for each upgrade
    document.getElementById("pointsDisplay").innerHTML = "Corgis everywhere!";
  }, randomTime);
}

$(function(){ //jquery for text on click effect (all animations are made in CSS3)
  var Borks = ['Bork', 'Bark', 'Woof', 'Wow', "Wan", "Arf", "Woff"]; //array with the various strings that can be spawned
	var fadeDelay = 160; //delay in ms before the animation cicks in (how long the text stays still)
	var fadeDuration = 1000; //duration of the animation in ms
    $('#corgi').click(function(e){ //called when clicked on the corgi (and only on the corgi)
    var randomBork = Borks[Math.floor(Math.random() * Borks.length)]; //random string per click
		var div = $('<div class="infoText">') //what will be spawned, infoText is the CSS class
			.css({ //the position of the element is spawned at the mouse position when clicked
				"left": e.pageX + 'px',
				"top": e.pageY + 'px'
			})
			.append($("<p>+" + multiplier + " " + randomBork + " </p>")) //appends a p-tag with the random text from the array
			.appendTo('body'); //it appends to the body, infront of the corgi

		setTimeout(function() { //timeout based on the duration/delay, when the animation should kick in
			div.addClass('fade-out');
			setTimeout(function() { div.remove(); }, fadeDuration); //when reached 0 opacity the element is deleted
		}, fadeDelay);
    });
});
