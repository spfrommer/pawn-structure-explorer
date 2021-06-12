from random_word import RandomWords
import numpy as np
import requests
import pdb

r = RandomWords()

def get_rand_words(n_words):
    rand_words = None
    while rand_words is None or len(rand_words) < n_words:
        rand_words = r.get_random_words(hasDictionaryDef="true", minCorpusCount=10000, minDictionaryCount=1, maxDictionaryCount=10, minLength=5, maxLength=20, sortBy="alpha", sortOrder="asc", limit=15)

    return rand_words[:n_words]

DATAPOINTS = 30
MAX_WORDS = 15
times = np.zeros((MAX_WORDS - 1, DATAPOINTS))
for n_words in range(1, MAX_WORDS):
    for i in range(DATAPOINTS):
        query = " ".join(get_rand_words(n_words))
        resp = requests.get('http://35.184.125.249/api/search', {'query': query}, timeout=None)
        times[n_words - 1, i] = resp.elapsed.total_seconds()
        print(f'{query}: {resp.elapsed.total_seconds()}')

    with open('times.npy', 'wb') as f:
        np.save(f, times)
