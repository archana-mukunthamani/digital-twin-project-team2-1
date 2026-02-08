import json

p = 'data/digitaltwin.json'
try:
    with open(p, 'r', encoding='utf-8') as f:
        s = f.read()
    print('FILE_LENGTH', len(s))
    try:
        json.loads(s)
        print('PARSE_OK')
    except Exception as e:
        print('PARSE_ERROR', repr(e))
except Exception as e:
    print('FILE_ERROR', e)
