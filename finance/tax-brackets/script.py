from itertools import tee

def _pairwise(iterable):
    # https://docs.python.org/3.8/library/itertools.html#itertools-recipes
    "s -> (s0,s1), (s1,s2), (s2, s3), ..."
    a, b = tee(iterable)
    next(b, None)
    return zip(a, b)

def calculate_tax(brackets, income):
    applicable_brackets = [bracket for bracket in brackets if income > bracket[0]]
    if not applicable_brackets:
        return 0

    last_breakpoint, last_rate = applicable_brackets[-1]
    amounts_with_rate = [(next_bracket[0] - bracket[0], bracket[1]) for bracket, next_bracket in _pairwise(applicable_brackets)]
    amounts_with_rate.append((income - last_breakpoint, last_rate))

    return sum([amount * (rate / 100) for amount, rate in amounts_with_rate])
