var loopRunning = false
var OurLeagueID = '964266473902419968'
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
    return fetch(`https://api.sleeper.com/v1/league/${lid}/matchups/${week}`)
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
    try{
        var matchups = await fetchMatchups(lid, week);
        var rosters = await fetchRosters(lid);
        var results = [];
        for(const matchup of matchups){
            var matchup_id = matchup.matchup_id
            var roster_id = matchup.roster_id;
            var roster = rosters.find(roster => roster.roster_id === roster_id);
            var uid = roster.owner_id;
            var displayName = await fetchDisplayName(uid);
            results.push({displayName, points: matchup.points, matchup_id});
        }
        return results;
    } catch (error){
        throw new Error(`Error in your getContent function: ${error}`)
    }
}

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
        data.forEach(item =>{
            //move the document.createElements outside of the forEach statement, so they are created once for each container item. dont forget to set each id of the smaller divs so we can know what goes where
            //then we can do the foreach and if matchup_id == i we can add the data by id to the layout.
            if (item.matchup_id == i && ~document.getElementById(`${i*2 - 1}`)){
                const team1 = document.createElement('div');
                const scorebox = document.createElement('div');
                const score1 = document.createElement('div');
                const score2 = document.createElement('div');
                const team2 = document.createElement('div');
                team1.classList.add('team-name');
                scorebox.classList.add('score-box');
                score1.classList.add('score');
                score2.classList.add('score');
                team2.classList.add('team-name')
                team1.setAttribute('id', `${i*2 - 1}`)
                team2.setAttribute('id', `${i*2}`)
                team1.innerHTML = `Team ${i*2 - 1}`;
                team2.innerHTML = `Team ${i*2}`
                score1.innerHTML = '0'
                score2.innerHTML = '0'
                scorebox.appendChild(score1)
                scorebox.appendChild(score2)
                leaderBoardItem.appendChild(team1)
                leaderBoardItem.appendChild(scorebox)
                leaderBoardItem.appendChild(team2);
            }
        })
        leaderBoardContainer.appendChild(leaderBoardItem);
    }
}
// data.forEach(item =>{
//     const leaderBoardItem = document.createElement('div');
//     leaderBoardItem.classList.add('leaderboard-item');
//     leaderBoardItem.innerHTML = `
//     <p>${item.displayName}</p>
//     <p>${item.points}</p>`;
//     leaderBoardContainer.appendChild(leaderBoardItem)
// })

async function setContent(){
    var data = await getContent()
}

// var week = await fetchCurrentWeek()
async function looper(LID){
    var week = await currentWeek;
    loopRunning = true;
    async function runLoop(){
        console.log("get content:", await getContent(LID, week))
        if(loopRunning) {
            setTimeout(runLoop, 5 * 1000)
        }
    }
    runLoop();
}

const testButton = document.getElementById("testButton")
async function handle(){
    console.log("Clicked!")
    if (loopRunning){
        loopRunning = false
        console.log("turning off")
    } else{
        console.log("turning on")
        await looper(StoredLeagueID)
    }
}
init();
testButton.addEventListener("click", handle);