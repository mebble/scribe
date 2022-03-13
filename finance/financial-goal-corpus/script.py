from itertools import cycle
from sys import argv

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
investment_horizon_months = int(argv[1])

print('No,Month,Months Left')
for i, (month, months_left) in enumerate(zip(cycle(months), range(investment_horizon_months, 0, -1))):
    print(f'{i},{month},{months_left}')
