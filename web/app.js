var loopRunning = false
var OurLeagueID = '964266473902419968'
var intervalId = null;
var StoredLeagueID = localStorage.getItem("LeagueID")
var currentWeek = fetchCurrentWeek()

//gets the current week of the nfl season from the api
async function fetchCurrentWeek(){
    return fetch('https://api.sleeper.app/v1/state/nfl')
    .then(response => response.json())
    .then(data => data.week);
}

//gets the league info
async function fetchLeagueData(lid){
    return fetch(`https://api.sleeper.app/v1/league/${lid}`)
    .then(response => response.json())
    .then(data => data);
}

//gets a list containing all matchups from the given league and week number
async function fetchMatchups(lid, week){
    return fetch(`https://api.sleeper.app/v1/league/${lid}/matchups/${week}`)
    .then(response => response.json())
    .then(data => data);
}

//gets a list of all current rosters in a league
async function fetchRosters(lid){
    return fetch(`https://api.sleeper.app/v1/league/${lid}/rosters`)
    .then(response => response.json())
    .then(data => data);
}

//gets somebodies display_name from their user ID
async function fetchDisplayName(uid){
    return fetch(`https://api.sleeper.app/v1/user/${uid}`)
    .then(response => response.json())
    .then(data => data.display_name);
}

// pulls display name and scores from fetchs
async function getContent(lid, week){
    try {
                var matchups = await fetchMatchups(lid, week);
                var rosters = await fetchRosters(lid);
    } catch (error) {
        throw new Error(`Error in fetching calls within getContent():${error}`);
    }
    try {
        var results = [];
        for(const matchup of matchups){
            var matchup_id = matchup.matchup_id
            var roster_id = matchup.roster_id;
            var roster = rosters.find(roster => roster.roster_id === roster_id);
            var uid = roster.owner_id;
            var displayName = await fetchDisplayName(uid);
            results.push({displayName, points: matchup.points, matchup_id, roster_id});
        }
        console.log(results)
        return results;
    } catch (error) {
        throw new Error(`error in looping through matchups in getContent():${error}`)
    }
}

// creates and populates the container with the correct ids and classes
async function init(){
    leaderBoardContainer.innerHTML = 'Loading...'
    leagueID = StoredLeagueID
    var leaguedata = await fetchLeagueData(leagueID)
    const data = await getContent(leagueID, await currentWeek);
    total_rosters = leaguedata.total_rosters
    data.sort((a, b)=> a.matchup_id - b.matchup_id);
    leaderBoardContainer.innerHTML = '';
    for(let i = 1; i<=total_rosters/2; i ++){
        const leaderBoardItem = document.createElement('div');
        leaderBoardItem.classList.add('leaderboard-item');
        const team1 = document.createElement('div');
        const scorebox = document.createElement('div');
        const score1 = document.createElement('div');
        const score2 = document.createElement('div');
        const team2 = document.createElement('div');
        const sep = document.createElement('hr');
        team1.classList.add('team-name');
        scorebox.classList.add('score-box');
        score1.classList.add('score');
        score2.classList.add('score');
        team2.classList.add('team-name')
        data.forEach(item =>{
            if ((item.matchup_id == i)){
                team1.setAttribute('id', `${item.roster_id}`)
                team2.setAttribute('id', `team-${i*2}`)
                score1.setAttribute('id', `score-${i*2-1}`)
                score2.setAttribute('id', `score-${i*2}`)
                team1.innerHTML = `Team ${i*2 - 1}`;
                team2.innerHTML = `Team ${i*2}`
                score1.innerHTML = `${item.points}`
                score2.innerHTML = `${item.points}`
                //looks like all my problems are coming from not having a intelligent structure so I cant dynamically update everything without issue. Check this next see of there is a smarter
                //way to iterate over the data OR iterate over the dom structure?? probably just itereate over the data better that makes more sense actually.
                //maybe use data.find or something to put the correct machups together??
            }
        });
        scorebox.appendChild(score1)
        scorebox.appendChild(sep)
        scorebox.appendChild(score2)
        leaderBoardItem.appendChild(team1)
        leaderBoardItem.appendChild(scorebox)
        leaderBoardItem.appendChild(team2);
        leaderBoardContainer.appendChild(leaderBoardItem);
    }
}


async function setContent(LID, week){
    const leaderboardItems = Array.from(document.querySelectorAll('.leaderboard-item'))
    const newData = await getContent(LID, week);
    leaderboardItems.forEach(div => {
        for(const child of div.getElementsByTagName('div')){
            if(child.classList == "score"){
                let childID = child.id.charAt(child.id.length - 1);
                let newChild = newData.find(newData=>newData.placementID == childID);
                if(newChild){
                    console.log("existed")
                }
            }
        }
    });
}


async function looper() {
    const leag = StoredLeagueID;
    const week = await currentWeek;
    intervalId = setInterval(async () => {
        await setContent(leag, week);
        console.log("looped")
    }, 5 * 1000);
}

async function handle(){
    console.log("Clicked!")
    if (loopRunning){
        loopRunning = false;
        clearInterval(intervalId);
        console.log("turning off");
    } else{
        loopRunning = true
        console.log("turning on")
        await looper()
    }
}
const testButton = document.getElementById("testButton")
testButton.addEventListener("click", handle);
init();