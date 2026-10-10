import urllib.request,json,pathlib,hashlib,concurrent.futures
root=pathlib.Path(__file__).resolve().parents[1]
(root/'assets'/'textures').mkdir(parents=True,exist_ok=True)
headers={'User-Agent':'Music-Worlds-Toolkit/0.1 (offline asset preparation)'}
def fetch(url):
 with urllib.request.urlopen(urllib.request.Request(url,headers=headers),timeout=45) as r:return r.read()
def asset(name):
 data=json.loads(fetch('https://api.polyhaven.com/files/'+name));out=[]
 for variants,short in [(['Diffuse','diff'],'diff'),(['nor_gl'],'normal'),(['Rough','rough'],'rough')]:
  k=next(k for k in variants if k in data);entry=data[k]['1k']['jpg'];url=entry['url'];raw=fetch(url)
  path=root/'assets'/'textures'/(name+'-'+short+'.jpg');path.write_bytes(raw)
  out.append({'asset':name,'kind':short,'source':'https://polyhaven.com/a/'+name,'url':url,'file':str(path.relative_to(root)),'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'license':'CC0','resolution':'1K'})
 return out
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool: records=[r for group in pool.map(asset,['rock_face','sparse_grass','wood_planks_grey','coast_sand_01','mossy_rock']) for r in group]
(root/'textures.json').write_text(json.dumps(records,indent=2))
print(json.dumps({'files':len(records),'bytes':sum(r['bytes'] for r in records),'sources':sorted(set(r['source'] for r in records))}))
