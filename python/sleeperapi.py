import json
import time
import requests
import datetime
# username should be the only input required for the app to run, with added options in the future
# these 4 values are used for testing just to simplify things for myselfS
my_name = 'benstratton7'
my_id = '964283483516416000'
meisters_league_id = '964266473902419968'
sleeperapi_url = 'https://api.sleeper.app/v1'


USER_ID = None
USER_LEAGUE_NAME = None
USER_LEAGUE_ID = None

# takes a username string and if there exist a user with that username in the db, returns their user id
def get_user_id(username):
    try:
        response = requests.get(f"{sleeperapi_url}/user/{username}")
        data = response.json()
        return data['user_id']
    except TypeError:
        print("This user could not be found")

# shows all the league data for a specific user_id
def show_leagues(uid):
    response = requests.get(f"{sleeperapi_url}/user/{uid}/leagues/nfl/{datetime.date.today().year}")
    data = response.json()
    return data

# show the names of each league in the users leagues list, with the associated leagueID
def get_league_names_and_id_list(uid):
    leagues = show_leagues(uid)
    names = []
    for i in leagues:
        names.append((i['name'], i["league_id"]))
    return names

# take a name and list of league tuples and if there exist a league with that name, returns the id of the league 
def get_league_id_by_name(name, leagues):
    for league in leagues:
        if league[0] == name:
            return str(league[1])
    return None  # Return None if the name is not found in the list

def show_league_data(lid):
    response = requests.get(f"{sleeperapi_url}/league/{lid}")
    data = response.json()
    return data

def get_players_in_league(lid):
    response = requests.get(f"{sleeperapi_url}/league/{lid}/users")
    data = response.json()
    return data

#tests below
def printjson(stuff):
    print(f"\n\n{json.dumps(stuff, indent = 4)}\n\n")

lidtest = get_league_id_by_name('League of Meisters', get_league_names_and_id_list(my_id))
print(lidtest)
response = requests.get(f"{sleeperapi_url}/league/{lidtest}/users")
data = response.json()
printjson(data)