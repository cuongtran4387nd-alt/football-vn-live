from rapidfuzz.fuzz import ratio
PREFERRED=[("Xôi Lạc",1),("Cà Khịa",2),("SoCoLive",3),("CoLa TV",4),("Lương Sơn",5),("Vebo TV",6),("Mì Tôm",7),("90 Phút",8),("S8 TV",9),("Nguồn Khác",10)]
def key(x):
 return " ".join(str(x).lower().replace("."," ").split())
def similarity(a,b):
 return ratio(key(a),key(b))
def dedupe(events):
 out=[]
 for e in events:
  found=None
  for x in out:
   same_day=e["start"][:10]==x["start"][:10]
   close=similarity(e["home"],x["home"])>=88 and similarity(e["away"],x["away"])>=88
   if same_day and close: found=x;break
  if found:
   if found["status"]!="live" and e["status"]=="live": found.update(e)
  else: out.append(e)
 return out
def candidates(_): return [{"name":n,"priority":p} for n,p in PREFERRED]
