import json
import time
import requests
import datetime
# username should be the only input required for the app to run, with added options in the future
my_name = 'benstratton7'
my_id = '964283483516416000'
meisters_league_id = '964266473902419968'
sleeperapi = 'https://api.sleeper.app/v1'


USER_ID = None
USER_LEAGUE_NAME = None
USER_LEAGUE_ID = None

def get_user_id(username):
    try:
        response = requests.get(f"{sleeperapi}/user/{username}")
        data = response.json()
        return data['user_id']
    except TypeError:
        print("This user could not be found")

def show_leagues(uid):
    response = requests.get(f"{sleeperapi}/user/{uid}/leagues/nfl/{datetime.date.today().year}")
    data = response.json()
    return data

# show the names of each league in the users leagues list, with the associated leagueID
def get_league_names_and_id_list(uid):
    leagues = show_leagues(uid)
    names = []
    for i in leagues:
        names.append((i['name'], i["league_id"]))
    return names

def show_league_data(lid):
    response = requests.get(f"{sleeperapi}/league/{lid}")
    data = response.json()
    return data

def printjson(stuff):
    print(f"This is a prettier version of the json:\n\n{json.dumps(stuff, indent = 4)}")

printjson(get_league_names_and_id_list(my_id))
print(get_league_names_and_id_list(my_id))