import pandas as pd
import numpy as np
import json
from sklearn.ensemble import RandomForestClassifier

# 1. Load the engineered features and OSRM matrix
df = pd.read_csv("processed_features.csv")
osrm_matrix = pd.read_csv("osrm_matrix.csv", index_col=0)

# 2. Generate Synthetic Labels for Training the Prototype
# In the real world, this would be historical labeled data. 
# Here, we teach the model that a shared delay elevates the risk.
def assign_risk_label(row):
    if row['supplier_delayed'] == 1 and row['days_to_stockout'] <= 21:
        return "Systemic Risk"
    elif row['days_to_stockout'] <= 14:
        return "Local Warning"
    else:
        return "Safe"

df['historical_label'] = df.apply(assign_risk_label, axis=1)

# 3. Train the Random Forest Classifier
X = df[['days_to_stockout', 'consumption_std', 'supplier_delayed']]
y = df['historical_label']

rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X, y)

# 4. Predict Current Risk and Generate Alerts
df['predicted_risk'] = rf_model.predict(X)
alerts = []
dashboard_nodes = []

for index, row in df.iterrows():
    hospital = row['hospital']
    risk = row['predicted_risk']
    
    # Calculate confidence based on standard deviation (erratic usage = lower confidence)
    confidence = "Low" if row['consumption_std'] > 18 else "High"
    
    node_data = {
        "hospital": hospital,
        "stock": int(row['current_stock']),
        "days_to_stockout": int(row['days_to_stockout']),
        "status": risk,
        "uncertainty_bound": float(row['consumption_std'])
    }
    
    # 5. Geographic Optimization (OSRM Routing)
    if risk in ["Local Warning", "Systemic Risk"]:
        # Find all 'Safe' hospitals
        safe_hospitals = df[df['predicted_risk'] == "Safe"]['hospital'].tolist()
        
        if safe_hospitals:
            # Look up travel times in OSRM matrix to find the fastest route
            travel_times = osrm_matrix.loc[safe_hospitals, hospital]
            best_donor = travel_times.idxmin()
            min_time = travel_times.min()
            
            action_text = f"Redistribute from {best_donor} ({min_time} mins via OSRM)"
        else:
            action_text = "CRITICAL: No local safe surplus. Escalate to state reserves."
            
        alerts.append({
            "id": index,
            "priority": risk,
            "facility": hospital,
            "message": f"Stockout in {int(row['days_to_stockout'])} days. Supplier delayed: {'Yes' if row['supplier_delayed'] == 1 else 'No'}.",
            "action": action_text,
            "confidence": confidence
        })
        
    dashboard_nodes.append(node_data)

# 6. Export to React Frontend
output_data = {
    "network_status": dashboard_nodes,
    "active_alerts": alerts
}

with open("src/data/liveDashboardData.json", "w") as f:
    json.dump(output_data, f, indent=4)

print("Pipeline complete. JSON exported to src/data/liveDashboardData.json.")