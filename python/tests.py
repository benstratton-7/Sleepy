import json
import requests

url = 'https://api.sleeper.app/v1/user/benstratton7'
leag = 'https://api.sleeper.app/v1/league/964266473902419968'
players = 'https://api.sleeper.app/v1/players/nfl'
matchups = 'https://api.sleeper.app/v1/league/964266473902419968/matchups/8'
week = 'https://api.sleeper.app/v1/state/nfl'
me = 'https://api.sleeper.app/v1/user/benstratton7'
rosts = 'https://api.sleeper.app/v1/league/964266473902419968/rosters'

cur = rosts

r = requests.get(cur)
rd = json.dumps(r.json())

with open(f'python/rosts.json', "w") as f:
    f.write(rd)