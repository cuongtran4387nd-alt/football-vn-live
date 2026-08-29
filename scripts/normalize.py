from datetime import datetime,timezone
def iso(x): return datetime.fromisoformat(x.replace("Z","+00:00")).astimezone(timezone.utc).isoformat().replace("+00:00","Z")
def norm(e,league):
 c=(e.get("competitions") or [{}])[0]; ts=c.get("competitors",[])
 h=next((x for x in ts if x.get("homeAway")=="home"),{}); a=next((x for x in ts if x.get("homeAway")=="away"),{})
 t=e.get("status",{}).get("type",{}); st=t.get("state")
 return {"id":str(e.get("id")),"home":h.get("team",{}).get("displayName",""),"away":a.get("team",{}).get("displayName",""),
 "home_score":h.get("score"),"away_score":a.get("score"),"competition":league,"country":e.get("league",{}).get("country",""),
 "start":iso(e["date"]),"status":"live" if st=="in" else ("finished" if st=="post" else ("postponed" if st in ("postponed","canceled") else "upcoming")),
 "clock":e.get("status",{}).get("displayClock") or "","source":"ESPN scoreboard"}