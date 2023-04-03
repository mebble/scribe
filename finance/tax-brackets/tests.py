import unittest
from script import calculate_tax

brackets_one = [
    (0, 0),
    (2_50_000, 5),
    (5_00_000, 10),
    (10_00_000, 30),
]

class TestTaxCalculatorOne(unittest.TestCase):
    def test_lowest_bracket_income(self):
        self.assertEqual(0, calculate_tax(brackets_one, -10))
        self.assertEqual(0, calculate_tax(brackets_one, 0))
        self.assertEqual(0, calculate_tax(brackets_one, 100))
        self.assertEqual(0, calculate_tax(brackets_one, 2_50_000))

    def test_middle_bracket_income(self):
        self.assertEqual(12_500, calculate_tax(brackets_one, 5_00_000))
        self.assertEqual(42_500, calculate_tax(brackets_one, 8_00_000))
        self.assertEqual(62_500, calculate_tax(brackets_one, 10_00_000))

    def test_highest_bracket_income(self):
        self.assertEqual(3_62_500, calculate_tax(brackets_one, 20_00_000))
        self.assertEqual(12_62_500, calculate_tax(brackets_one, 50_00_000))

brackets_two = [
    (0, 0),
    (3_00_000, 5),
    (6_00_000, 10),
    (9_00_000, 15),
    (12_00_000, 20),
    (15_00_000, 30),
]

class TestTaxCalculatorTwo(unittest.TestCase):
    def test_lowest_bracket_income(self):
        self.assertEqual(0, calculate_tax(brackets_two, -10))
        self.assertEqual(0, calculate_tax(brackets_two, 0))
        self.assertEqual(0, calculate_tax(brackets_two, 100))
        self.assertEqual(0, calculate_tax(brackets_two, 3_00_000))

    def test_middle_bracket_income(self):
        self.assertEqual(10_000, calculate_tax(brackets_two, 5_00_000))
        self.assertEqual(35_000, calculate_tax(brackets_two, 8_00_000))
        self.assertEqual(60_000, calculate_tax(brackets_two, 10_00_000))
        self.assertEqual(90_000, calculate_tax(brackets_two, 12_00_000))

    def test_highest_bracket_income(self):
        self.assertEqual(3_00_000, calculate_tax(brackets_two, 20_00_000))
        self.assertEqual(12_00_000, calculate_tax(brackets_two, 50_00_000))
