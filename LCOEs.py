import csv, json, sys

with open("iso23.csv") as isof:
    isof.readline()
    isos = dict((y, x) for (x, y) in csv.reader(isof))

print(json.dumps({ 'data': { isos[c.pop("Country")]: { k: float(v) for (k, v) in c.items() }  for c in csv.DictReader(sys.stdin) } }, indent=2))
