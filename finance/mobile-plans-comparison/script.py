import json
import os

script_path = os.path.dirname(__file__)
plans_json_path = os.path.join(script_path, './plans.json')

def rate(rs, days, gb):
    return (round(rs/days, 2), round(rs/gb, 2))

def print_header():
    print("{:^11s}|{:^11s}|{:^11s}|{:^11s}|{:^11s}|{:^11s}|".format('Price', 'Days', 'GB/day', 'GB', 'Price/day', 'Price/GB'))

def print_row(plan, gb, rs_day, rs_gb):
    rs = plan['rs']
    days = plan['days']
    gb_day = plan.get('gb/d', '')
    print("{:11.2f}|{:11}|{:11}|{:11}|{:11.2f}|{:11.2f}|".format(rs, days, gb_day, gb, rs_day, rs_gb))

def get_gb(plan):
    days = plan['days']
    gb = plan.get('gb')
    if gb == None:
        return plan['gb/d'] * days
    return gb

with open(plans_json_path) as fd:
    plans = json.load(fd)

    print_header()
    for plan in plans:
        (rs, days, gb) = (plan['rs'], plan['days'], get_gb(plan))
        (rs_day, rs_gb) = rate(rs, days, gb)
        print_row(plan, gb, rs_day, rs_gb)
