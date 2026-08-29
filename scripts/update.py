import json,sys
from pathlib import Path
from datetime import datetime,timezone,timedelta
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(Path(__file__).resolve().parent))
from sources.espn import fetch,LEAGUES
from matcher import candidates,dedupe
NOW=datetime.now(timezone.utc);END=NOW+timedelta(hours=24)
def main():
 all_events=[];health=[]
 for code,name in LEAGUES.items():
  t=datetime.now(timezone.utc).isoformat()
  try:
   ev=fetch(code);all_events+=ev;health.append({"id":code,"name":name,"ok":True,"count":len(ev),"checked_at":t})
  except Exception as e:health.append({"id":code,"name":name,"ok":False,"error":str(e),"checked_at":t})
 events=[]
 for e in dedupe(all_events):
  dt=datetime.fromisoformat(e["start"].replace("Z","+00:00"))
  if e["status"]=="finished":continue
  if e["status"]=="live" or NOW<=dt<=END:
   e["channels"]=candidates(e);events.append(e)
 stamp=datetime.now(timezone.utc).isoformat().replace("+00:00","Z")
 (ROOT/"data/matches.json").write_text(json.dumps({"updated_at":stamp,"timezone":"Asia/Ho_Chi_Minh","window_hours":24,"matches":sorted(events,key=lambda x:x["start"])},ensure_ascii=False,indent=2),encoding="utf-8")
 (ROOT/"data/health.json").write_text(json.dumps({"updated_at":stamp,"sources":health},ensure_ascii=False,indent=2),encoding="utf-8")
 print("events",len(events),"sources",len(health),"ok",sum(x["ok"] for x in health))
if __name__=="__main__":main()
