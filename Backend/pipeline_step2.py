import pandas as pd
import numpy as np
from scipy.stats import linregress

# Load the raw signal generated in Step 1
df = pd.read_csv("historical_inventory.csv")

processed_features = []
latest_date = df['date'].max()

for hospital in df['hospital'].unique():
    hosp_data = df[df['hospital'] == hospital].sort_values('date')
    
    # 1. Extract the raw consumption signal
    x = np.arange(len(hosp_data))
    y = hosp_data['daily_consumption'].values
    
    # 2. Run SciPy Linear Regression to find the demand trend
    slope, intercept, r_value, p_value, std_err = linregress(x, y)
    
    # 3. Calculate Uncertainty Bounds (Standard Deviation)
    # High variance here means the dashboard will render a wider, lower-confidence shade
    consumption_std = np.std(y)
    
    # 4. Forecast Tomorrow's Baseline Drain 
    projected_daily_drain = intercept + (slope * (len(hosp_data) + 1))
    projected_daily_drain = max(1, projected_daily_drain) # Prevent negative drain
    
    # 5. Extract Current State Constraints
    latest_record = hosp_data[hosp_data['date'] == latest_date].iloc[0]
    current_stock = latest_record['stock_remaining']
    supplier = latest_record['supplier']
    supplier_delayed = latest_record['supplier_delayed']
    
    # 6. Calculate the core metric: Time-to-Stockout
    days_to_stockout = int(current_stock / projected_daily_drain)
    
    processed_features.append({
        "hospital": hospital,
        "supplier": supplier,
        "current_stock": current_stock,
        "projected_daily_drain": round(projected_daily_drain, 2),
        "consumption_std": round(consumption_std, 2),  # The uncertainty metric
        "days_to_stockout": days_to_stockout,
        "supplier_delayed": supplier_delayed
    })

# Export the engineered features for the Random Forest classifier
df_processed = pd.DataFrame(processed_features)
df_processed.to_csv("processed_features.csv", index=False)

print(df_processed[['hospital', 'days_to_stockout', 'consumption_std', 'supplier_delayed']])