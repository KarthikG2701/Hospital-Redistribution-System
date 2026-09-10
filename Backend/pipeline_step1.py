import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# 1. Define Network Nodes and Relationships (10 Hospitals, 3 Suppliers)
hospitals = [
    "Victoria Hospital", "Aster CMI (Hebbal)", 
    "Manipal Hospital (HAL)", "Apollo (Jayanagar)", 
    "Fortis (Bannerghatta)", "NIMHANS",
    "St. John's Medical", "Ramaiah Memorial",
    "Narayana Health (Bommasandra)", "BGS Gleneagles (Kengeri)"
]

# Partitioning hospitals to model localized and systemic bottlenecks
supplier_mapping = {
    "Victoria Hospital": "Supplier_A",
    "NIMHANS": "Supplier_A",
    "Apollo (Jayanagar)": "Supplier_A",
    "St. John's Medical": "Supplier_A",
    
    "Aster CMI (Hebbal)": "Supplier_B",
    "Manipal Hospital (HAL)": "Supplier_B",
    "Ramaiah Memorial": "Supplier_B",
    
    "Fortis (Bannerghatta)": "Supplier_C",
    "Narayana Health (Bommasandra)": "Supplier_C",
    "BGS Gleneagles (Kengeri)": "Supplier_C"
}

# 2. Construct Static OSRM Matrix (Travel Time in Minutes)
osrm_matrix = pd.DataFrame({
    "Victoria Hospital":             [0,  45, 35, 15, 30, 10, 20, 35, 55, 40],
    "Aster CMI (Hebbal)":            [45, 0,  50, 55, 65, 40, 50, 20, 80, 60],
    "Manipal Hospital (HAL)":        [35, 50, 0,  25, 45, 30, 20, 55, 60, 70],
    "Apollo (Jayanagar)":            [15, 55, 25, 0,  20, 12, 15, 45, 40, 35],
    "Fortis (Bannerghatta)":         [30, 65, 45, 20, 0,  25, 20, 55, 30, 45],
    "NIMHANS":                       [10, 40, 30, 12, 25, 0,  15, 40, 45, 35],
    "St. John's Medical":            [20, 50, 20, 15, 20, 15, 0,  45, 35, 50],
    "Ramaiah Memorial":              [35, 20, 55, 45, 55, 40, 45, 0,  75, 50],
    "Narayana Health (Bommasandra)": [55, 80, 60, 40, 30, 45, 35, 75, 0,  65],
    "BGS Gleneagles (Kengeri)":      [40, 60, 70, 35, 45, 35, 50, 50, 65, 0]
}, index=hospitals)

# 3. Simulate 30-Day Historical Consumption
np.random.seed(42) # Reproducibility for prototyping
days = 30
end_date = datetime.today()
dates = [end_date - timedelta(days=x) for x in range(days)]

data_rows = []
for hospital in hospitals:
    base_consumption = np.random.randint(40, 120) 
    
    # Generate daily consumption with signal noise
    daily_usage = np.random.normal(loc=base_consumption, scale=base_consumption*0.2, size=days)
    daily_usage = np.clip(daily_usage, a_min=10, a_max=None).astype(int) 
    
    starting_stock = np.random.randint(1500, 5000)
    stock_levels = [starting_stock]
    for i in range(1, days):
        stock_levels.append(stock_levels[i-1] - daily_usage[i])
        
    supplier = supplier_mapping[hospital]
    for i, date in enumerate(reversed(dates)):
        # Injecting systemic delay into Supplier_A for the final 3 days
        is_delayed = 1 if (supplier == "Supplier_A" and i >= days - 3) else 0
        
        data_rows.append({
            "date": date.strftime('%Y-%m-%d'),
            "hospital": hospital,
            "supplier": supplier,
            "daily_consumption": daily_usage[i],
            "stock_remaining": max(0, stock_levels[i]),
            "supplier_delayed": is_delayed
        })

df_historical = pd.DataFrame(data_rows)
df_historical.to_csv("historical_inventory.csv", index=False)
osrm_matrix.to_csv("osrm_matrix.csv")

print("Generated 10-node network with 30-day simulated history.")