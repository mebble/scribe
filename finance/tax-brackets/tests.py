import unittest
import math
from script import calculate_tax

brackets = [
    (0, 2_50_000, 0),
    (2_50_000, 5_00_000, 5),
    (5_00_000, 10_00_000, 10),
    (10_00_000, math.inf, 30),
]

class TestTaxCalculator(unittest.TestCase):
    def test_lowest_bracket_income(self):
        self.assertEqual(0, calculate_tax(brackets, 0))
        self.assertEqual(0, calculate_tax(brackets, 100))
        self.assertEqual(0, calculate_tax(brackets, 2_50_000))

    def test_middle_bracket_income(self):
        self.assertEqual(12_500, calculate_tax(brackets, 5_00_000))
        self.assertEqual(42_500, calculate_tax(brackets, 8_00_000))
        self.assertEqual(62_500, calculate_tax(brackets, 10_00_000))

    def test_highest_bracket_income(self):
        self.assertEqual(3_62_500, calculate_tax(brackets, 20_00_000))
        self.assertEqual(12_62_500, calculate_tax(brackets, 50_00_000))
