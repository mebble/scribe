from pprint import pprint

def perc(fraction):
    percentage = fraction * 100
    return f"{percentage:.2f}%"

def scale_part(fractional_part, total):
    name, fraction = fractional_part
    return (name, fraction * total)

def parts_total(parts):
    return sum(map(lambda p: p[1], parts))

def parts_fractions(parts):
    total = parts_total(parts)
    return [(name, amount / total) for name, amount in parts]

def print_parts(title, parts):
    fractions = parts_fractions(parts)
    parts_with_fractions = [(p[0], p[1], perc(f[1])) for p, f in zip(parts, fractions)]
    print(title + ":")
    print("Total:", parts_total(parts))
    pprint(parts_with_fractions)

parts = [('nippon', 5), ('parag', 2), ('dsp mid', 4), ('large and mid', 2.5), ('icici index', 5), ('axis small', 5)]

fractions = parts_fractions(parts)
assert sum([fraction for _, fraction in fractions]) == 1

maybe_new_total = 40
scaled_parts = [scale_part(f, maybe_new_total) for f in fractions]

adjusted_parts = [('nippon', 8), ('parag', 5), ('dsp mid', 6), ('large and mid', 5), ('icici index', 9), ('axis small', 9)]

print_parts("Old parts", parts)
print_parts("Scaled parts", scaled_parts)
print_parts("Adjusted parts", adjusted_parts)
