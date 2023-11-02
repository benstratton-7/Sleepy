
var loopRunning = false
var matchupData = {}
var LeagueID = '964266473902419968'
// var LeagueID = localStorage.getItem("LeagueID")
// Gets the current week number from the api


async function fetchCurrentWeek(){
    return fetch('https://api.sleeper.app/v1/state/nfl')
    .then(response => response.json())
    .then(data => data.week);
}

async function fetchMatchups(LeagueID, week){
    return fetch(`https://api.sleeper.com/v1/league/${LeagueID}/matchups/${week}`)
    .then(response => response.json())
    .then(data => data);
}

async function organizedMatchups(matchups_dict){
    var newDicts = []
    try {
        matchups_dict.forEach(element => {
            const id = element['matchup_id'];
            if (!newDicts[id]){
                newDicts[id] = []
            }
            newDicts[id].push(element)
        });
    } catch (error){
        console.log('this error occured when goin thru organizedMatchups:\n', error)
        return
    }
    console.log("this is organizedMatchups() return value, var newDicts:", newDicts)
    return newDicts
}

// var week = await fetchCurrentWeek()
async function updateGridItems(LID){
    var week = 8;
    loopRunning = true;
    async function runLoop(){
        let scores = await getMatchupScores(LID, week);
        // do some stuff here, and pass what is needed into setContent()
        setContent(/*some values*/);
        if(loopRunning) {
            setTimeout(runLoop, 5000)
        }
    }
    runLoop();
}

async function getMatchupScores(LID, week){
    // var week = await fetchCurrentWeek()
    var matches = await organizedMatchups(await fetchMatchups(LID, week))
    let scores = []
    for(let i = 1; i<matches.length; i ++){
        scores.push([matches[i][0]['points'], matches[i][1]['points']])
    }
    console.log("this is the returned value of getMatchupScores(), var scores:", scores)
    return scores
}

function setContent(){
    var item1 = document.getElementById("gridItem1");
    var item2 = document.getElementById("gridItem2");
    var item3 = document.getElementById("gridItem3");

    item1.textContent = "scores for 1";
    item2.textContent = "scores for 2";
    item3.textContent = "scores for 3";
}


const testButton = document.getElementById("testButton")
async function handle(){
    if (loopRunning){
        loopRunning = false
    } else{
        updateGridItems(LeagueID)
    }
}
testButton.addEventListener("click", handle)

// async function tests(){
//     loopRunning = true
//     let totals = 1
//     async function runLoopies(){
//         for (let index = 0; index < 5; index++) {
//             console.log("index" + index)
//         }
//         if(loopRunning){
//             setTimeout(runLoopies, 10000)
//         }
//         console.log("totals" + totals)
//         totals++
//     }
//     runLoopies()
// }