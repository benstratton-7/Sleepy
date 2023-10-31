import json
import requests

url = 'https://api.sleeper.app/v1/user/benstratton7'
leag = 'https://api.sleeper.app/v1/league/964266473902419968'
players = 'https://api.sleeper.app/v1/players/nfl'
matchups = 'https://api.sleeper.app/v1/league/964266473902419968/matchups/8'

cur = matchups

r = requests.get(cur)
rd = json.dumps(r.json())

with open('tests.json', "w") as f:
    f.write(rd)