let playerName = ""; // store player name
let time = 60; // Countdown to answer correct at every stage
let currentLevel = 0; // Level
let wizardPosition = 5; // Position of wizard
let multiplicand = []; // Random Renerated multiplicand
let multiplier = []; // Random Renerated multiplier
let answer = 0; // Correct answer Position
let startdown; // Interval Variable for countdown
let interval = []; // Moving ghost Interval array
let shift = [2,2,2,2,2,2]; // Move each ghost position

// STOP Time Interval
const stopCountdown = (stop) => {
    clearInterval(stop);
};

// Clear time interval for every ghost
const clearAllInterval = () => {
    console.log("All clear")
    shift = [];
    shift = [2,2,2,2,2,2];
    //document.querySelectorAll(".question").style.left = "2%";
    interval.forEach(ele => clearInterval(ele));
};

// Increase the level and set countdown
const switchLevel = () => {
    document.querySelector('.game-content span').style.display = 'none';
    document.querySelector('.startpage').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    currentLevel++;

    // Winner is declared
    if(currentLevel >= 6) {
        document.querySelector('.game-area').style.display = 'none';
        document.querySelector('.gameover').style.display = 'block';
        document.querySelector('.gameover h1').innerText = 'You Win the Game';
        storeHighScore();
        return;
    }

    document.getElementById("level").innerText = currentLevel;

    // Start the countdown
    time = 60; // re-initiated the timer count
    startdown = window.setInterval(() => {
        time -= 1;
        document.getElementById('time').innerText = time;
        if(time <= 0) {
            stopCountdown(startdown);
            clearAllInterval();
            // display Game Over
            document.querySelector('.game-area').style.display = 'none';
            document.querySelector('.gameover').style.display = 'block';
        }    
    }, 1000);
};

// Start Game function
const startGameHandler = () => {
    const name = document.querySelector('.game-content input').value;
    if(name) {
        if("highscore" in localStorage){
            let highscoredata = JSON.parse(localStorage.getItem("highscore"));
            if(highscoredata.some(elem => elem.name != name)) {
                playerName = name.toUpperCase();
                switchLevel();        
                generateQuestions();
                document.querySelector("#area"+ wizardPosition +" .wizard span").innerText = (multiplier[answer] * multiplicand[answer]);
            } else {
                alert("User name Already Exists");
                return;
            }
        } else {
            playerName = name.toUpperCase();
            switchLevel();        
            generateQuestions();
            document.querySelector("#area"+ wizardPosition +" .wizard span").innerText = (multiplier[answer] * multiplicand[answer]);
        }
    } else {
        document.querySelector('.game-content span').style.display = 'block';
        return;
    }    
};

// Display High Score Data
const displayHighScoreHandler = () => {
    document.querySelector('.game').style.display = 'none';
    document.querySelector('.startpage').style.display = 'none';
    document.querySelector('.game-highscore').style.display = 'flex';
    document.getElementById("highscore-data").innerHTML = "";
    console.log("Here")
    let displayHS = "";
    if("highscore" in localStorage) {
        const highscoredata = JSON.parse(localStorage.getItem("highscore"));
        displayHS += '<ol class="hs-list">'
        highscoredata.forEach(element => {
            displayHS += '<li>'+ element.name +' - Level '+ element.level +'</li>'
        });
        displayHS += '</ol>'
    } else {
        displayHS = '<p>No High Score Found!</p>';
    }
    document.getElementById("highscore-data").innerHTML = displayHS;
};

// General Object Sort function for level
const sortbyLevel = (a, b) => {
    if(a.level > b.level) return -1;
    if(a.level < b.level) return 1;
    return 0;
};

// store High Score
const storeHighScore = () => {
    console.log("Here!!!");
    let storescore = null;
    const level = currentLevel - 1;
    if("highscore" in localStorage) {
        let highscoredata = JSON.parse(localStorage.getItem("highscore"));
        
        // If highscore is not made
        console.log(highscoredata);
        console.log(highscoredata.length, level);
        if(highscoredata.length >= 5 && highscoredata[highscoredata.length -1].level > level) {
            return;
        }

        // Update Score
        highscoredata.push({name: playerName, level: level});
        highscoredata.sort(sortbyLevel);
        storescore = highscoredata.slice(0,5);
    } else {
        storescore = [{name: playerName, level: level}];
    }
    console.log(storescore);
    localStorage.setItem("highscore", JSON.stringify(storescore));
};

// Audio Handler Manage
const toggleAudioHandler = () => {
    const myAudio = document.getElementById("bgm");
    if(myAudio.paused) {
        myAudio.play();
        document.querySelector('#volumeBtn img').src = 'assets/volume.png';
    } else {
        myAudio.pause();
        document.querySelector('#volumeBtn img').src = 'assets/mute.png';
    }
}

// Generate Random Questions
const generateQuestions = () => {
    //multiplicand = multiplier = [];
    let top = 6;
    let areaCount = 0;
    answer = Math.floor(Math.random() * (top - 1));
    while(--top){
        console.log(top);
        const i = areaCount;
        ++areaCount;
        const m1 = Math.floor(Math.random() * 15) + 1;
        const m2 = Math.floor(Math.random() * 10) + 1;
        multiplicand.push(m1);
        multiplier.push(m2);
        document.querySelector("#area"+ areaCount +" .question span").innerText = m1 +" X "+ m2 +" = ?";
        
        const intTime = Math.floor(Math.random() * 800) + 500;
        const intData = setInterval(() => {
            shift[i] += (shift[i] >= 90) ? -80 : 2;
            //console.log("DATA PRINT --------------------------");
            //console.log(shift[i], i);
            //console.log(document.querySelector('#area'+ (i + 1) +' .question'));
            document.querySelector('#area'+ (i + 1) +' .question').style.left = shift[areaCount - 1]+'%';
        }, intTime);
        interval.push(intData);

        
    }
    console.log("Question Generated")
    console.log(multiplicand, multiplier, answer);
};

// Shift Wizard Position i.e Moving wizard
const shiftWizard = position => {
    
    console.log("Start: "+wizardPosition);
    const child = document.querySelector("#area"+ wizardPosition +" .wizard");
    document.querySelector("#area"+ wizardPosition).removeChild(child);

    if(position === "up") {
        wizardPosition = wizardPosition <= 1 ? 5 : wizardPosition - 1;
    } else {
        wizardPosition = wizardPosition >= 5 ? 1 : wizardPosition + 1;
    }

    console.log("End: "+wizardPosition);
    document.querySelector("#area"+ wizardPosition).appendChild(child);
};


// Handle Keyboard keypress
const keyboardHandler = (evt) => {
    if(evt.keyCode === 40) {
        // Key Down
        console.log("I m Down key");
        shiftWizard("down")
    } else if(evt.keyCode === 38) {
        //Key Up
        console.log("I m UP key");
        shiftWizard("up")
    } else if(evt.keyCode === 32 && currentLevel > 0) {
        // Space
        console.log("I m Space");
        
        const tempanswer = (multiplicand[answer] * multiplier[answer]) === (multiplicand[wizardPosition - 1] * multiplier[wizardPosition - 1]);

        //console.log(wizardPosition, answer, tempanswer, multiplier, multiplicand);

        if((wizardPosition === (answer + 1)) || tempanswer) {
            stopCountdown(startdown);
            clearAllInterval();
            switchLevel();
            multiplicand = []; 
            multiplier = [];
            generateQuestions();

            // initated the wizard position
            const child = document.querySelector("#area"+ wizardPosition +" .wizard");
            document.querySelector("#area"+ wizardPosition).removeChild(child);
            wizardPosition = 5;
            document.querySelector("#area"+ wizardPosition).appendChild(child);

            // Update Answer
            document.querySelector("#area"+ wizardPosition +" .wizard span").innerText = (multiplier[answer] * multiplicand[answer]);
        } else {
            stopCountdown(startdown);
            clearAllInterval();
            // display Game Over
            //console.log("Game Over Here!");
            document.querySelector('.game-area').style.display = 'none';
            document.querySelector('.gameover').style.display = 'block';
            if(currentLevel >= 1) {
                storeHighScore();
            }
        }
    } else {
        console.log("Invalid Game Input");
    }
};


// Manage OnClick Handlers
document.getElementById('start-game').addEventListener('click', startGameHandler);
document.querySelector('body').addEventListener('keydown', keyboardHandler);
document.querySelector('#volumeBtn').addEventListener("click", toggleAudioHandler);
document.getElementById('highscore').addEventListener('click', displayHighScoreHandler);
document.getElementById('view-rules').addEventListener('click', () => {
    document.querySelector('.startpage').style.display = 'none';
    document.querySelector('.game-rules').style.display = 'flex';
});

