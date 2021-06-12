import numpy as np
import matplotlib.pyplot as plt
import seaborn as sb

import pdb

with open('times.npy', 'rb') as f:
    data = np.load(f)

# data = np.array([np.random.normal(loc=i, size=(100,)) for i in range(10)])
plt.rcParams['font.size'] = '20'

ax = sb.violinplot(data=data.T)

ax.set_xticklabels(list(range(1, data.shape[0] + 1)))
ax.set_xlabel('Number of words')
ax.set_ylabel('Query time (s)')

# fig, ax = plt.subplots()
# violin_parts = ax.violinplot(dataset=diff.T,positions=range(10))
# for pc in violin_parts['bodies']:
    # pc.set_facecolor('red')
    # pc.set_edgecolor('black')

plt.show()
