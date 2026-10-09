"""Regression checks for the illustrative Mabun renewal model."""
import unittest
from mabun_renewal_v1 import Params, run

class RenewalTests(unittest.TestCase):
    def test_moderate_need(self):
        result = run(Params(need=30))
        self.assertEqual(result["total_unmet_need"], 0)
        self.assertTrue(result["reserve_held"])

    def test_excess_need(self):
        result = run(Params(need=70))
        self.assertGreater(result["periods_with_shortfall"], 0)
        self.assertTrue(result["reserve_held"])

    def test_zero_need(self):
        self.assertEqual(run(Params(need=0))["total_unmet_need"], 0)

    def test_invalid_rate(self):
        with self.assertRaises(ValueError):
            run(Params(rate=-1))

if __name__ == "__main__":
    unittest.main()
