import requests
from normalize import norm
LEAGUES={"eng.1":"Premier League","esp.1":"LaLiga","ita.1":"Serie A","ger.1":"Bundesliga","fra.1":"Ligue 1","uefa.champions":"UEFA Champions League","uefa.europa":"UEFA Europa League","uefa.europa.conf":"UEFA Conference League","eng.2":"Championship","ned.1":"Eredivisie","por.1":"Primeira Liga","bel.1":"Belgian Pro League","tur.1":"Turkish Super Lig","usa.1":"MLS","usa.nwsl":"NWSL","uefa.wchampions":"Women's Champions League"}
def fetch(league):
 u=f"https://site.api.espn.com/apis/site/v2/sports/soccer/{league}/scoreboard"
 r=requests.get(u,params={"limit":1000},timeout=20,headers={"User-Agent":"football-vn-live-v3/1.0"});r.raise_for_status()
 return [norm(e,LEAGUES[league]) for e in r.json().get("events",[])]
