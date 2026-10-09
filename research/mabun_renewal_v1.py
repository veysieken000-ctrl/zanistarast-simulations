"""Mabun renewal scenario. Normalized units, illustrative only."""
from dataclasses import dataclass

@dataclass(frozen=True)
class Params:
    stock: float = 600
    capacity: float = 1000
    rate: float = 0.2
    need: float = 30
    reserve_ratio: float = 0.3
    periods: int = 50

def run(p):
    if not (0 <= p.stock <= p.capacity and p.capacity > 0 and
            0 <= p.rate <= 1 and p.need >= 0 and
            0 <= p.reserve_ratio <= 1 and 1 <= p.periods <= 10000):
        raise ValueError("invalid parameters")
    stock, unmet, shortfalls = p.stock, 0.0, 0
    reserve = p.capacity * p.reserve_ratio
    for _ in range(p.periods):
        growth = p.rate * stock * (1 - stock / p.capacity)
        harvest = min(p.need, max(0, stock + growth - reserve))
        stock = stock + growth - harvest
        shortfall = max(0, p.need - harvest)
        unmet += shortfall
        shortfalls += shortfall > 1e-9
        assert stock + 1e-9 >= reserve
    return {"final_stock": round(stock, 6),
            "total_unmet_need": round(unmet, 6),
            "periods_with_shortfall": shortfalls,
            "reserve_held": stock + 1e-9 >= reserve}

if __name__ == "__main__":
    for need in (30, 70):
        print(need, run(Params(need=need)))
