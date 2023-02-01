def calculate_tax(brackets, income):
    applicable_brackets = [bracket for bracket in brackets if income >= bracket[0]]
    lesser_brackets = applicable_brackets[:-1]
    last_bracket = applicable_brackets[-1]
    amounts_with_rate = [(upper - lower, rate) for lower, upper, rate in lesser_brackets]
    amounts_with_rate.append((income - last_bracket[0], last_bracket[2]))
    return sum([amount * (rate / 100) for amount, rate in amounts_with_rate])
