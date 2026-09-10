import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta

hospitals = [
    "Victoria Hospital", "Aster CMI (Hebbal)", "Manipal Hospital (HAL)", 
    "Apollo (Jayanagar)", "Fortis (Bannerghatta)", "NIMHANS",
    "St. John's Medical", "Ramaiah Memorial", "Narayana Health", "BGS Gleneagles"
]

# Re-introduced Cold Chain classifications
medicines = {
    "Amoxicillin": {"max_time": 120, "type": "Standard"},
    "Insulin": {"max_time": 90, "type": "Cold Chain"}, 
    "O-Negative Blood": {"max_time": 60, "type": "Strict Cold Chain"},
    "Azithromycin": {"max_time": 120, "type": "Standard"},
    "Propofol": {"max_time": 60, "type": "Strict Cold Chain"}
}

# Base times increased slightly (20 to 60 mins) to mathematically force cold-chain rejections
base_osrm = pd.DataFrame(np.random.randint(20, 60, size=(10, 10)), index=hospitals, columns=hospitals)
np.fill_diagonal(base_osrm.values, 0)

# 1. Staged Cascade Roles
roles = {
    "Victoria Hospital": {"role": "Ground Zero", "stock": 20, "drain": 35},
    "NIMHANS": {"role": "Vulnerable", "stock": 400, "drain": 25},
    "Apollo (Jayanagar)": {"role": "Vulnerable", "stock": 450, "drain": 25},
    "Manipal Hospital (HAL)": {"role": "Vulnerable", "stock": 380, "drain": 25},
    "BGS Gleneagles": {"role": "Vulnerable", "stock": 420, "drain": 25},
    "Aster CMI (Hebbal)": {"role": "Donor", "stock": 900, "drain": 10},
    "Fortis (Bannerghatta)": {"role": "Donor", "stock": 850, "drain": 10},
    "Ramaiah Memorial": {"role": "Donor", "stock": 880, "drain": 10},
    "St. John's Medical": {"role": "Donor", "stock": 950, "drain": 10},
    "Narayana Health": {"role": "Donor", "stock": 920, "drain": 10}
}

system_state = {}
for h in hospitals:
    system_state[h] = {}
    for med in medicines:
        system_state[h][med] = {
            "stock": roles[h]["stock"] + np.random.randint(-20, 20),
            "drain": roles[h]["drain"]
        }

simulation_timeline = []
today = datetime.today()

# 2. Run the 15-Day Simulation Loop
for day in range(15):
    current_date_str = (today + timedelta(days=day)).strftime('%b %d')
    daily_nodes = []
    daily_routes = []
    daily_logs = []

    if day == 4:
        daily_logs.append(">> SYS.ALERT: REGIONAL SURGE DETECTED. MASS CASUALTY INCIDENT IN SOUTHERN SECTOR.")
        for h in hospitals:
            if roles[h]["role"] == "Vulnerable":
                for med in medicines:
                    system_state[h][med]["drain"] += 55 

    for h in hospitals:
        hosp_data = {"hospital": h, "inventory": {}}
        for med in medicines:
            if day > 0:
                actual_drain = int(np.random.normal(system_state[h][med]["drain"], system_state[h][med]["drain"] * 0.1))
                system_state[h][med]["stock"] = max(0, system_state[h][med]["stock"] - actual_drain)

            curr_stock = system_state[h][med]["stock"]
            drain_rate = system_state[h][med]["drain"]

            forecast = []
            sim_stock = curr_stock
            for i in range(15):
                f_date = (today + timedelta(days=day+i)).strftime('%b %d')
                forecast.append({"date": f_date, "projected_stock": max(0, sim_stock)})
                sim_stock -= drain_rate

            stock_day_7 = forecast[7]["projected_stock"]
            days_to_stockout = curr_stock // drain_rate if drain_rate > 0 else 99

            if curr_stock <= 50 or stock_day_7 <= 0:
                status = "Critical Deficit"
            elif curr_stock >= 400 and stock_day_7 >= 200:
                status = "Surplus"
            else:
                status = "Stable"

            hosp_data["inventory"][med] = {
                "current_stock": curr_stock,
                "days_to_stockout": days_to_stockout,
                "status": status,
                "forecast": forecast
            }
        daily_nodes.append(hosp_data)

    # 3. Routing & Replenishment 
    for med, specs in medicines.items():
        deficits = [n for n in daily_nodes if n["inventory"][med]["status"] == "Critical Deficit"]
        surpluses = [n for n in daily_nodes if n["inventory"][med]["status"] == "Surplus"]
        
        for target in deficits:
            best_route = None
            lowest_cost = float('inf')
            
            for donor in surpluses:
                if system_state[donor["hospital"]][med]["stock"] < 300:
                    continue
                    
                base_time = base_osrm.loc[donor["hospital"], target["hospital"]]
                traffic_multiplier = round(np.random.uniform(1.0, 1.5), 2)
                actual_time = int(base_time * traffic_multiplier)
                
                # EXPLICIT COLD CHAIN REJECTION LOGGING
                if actual_time > specs["max_time"]:
                    if specs["type"] != "Standard":
                        daily_logs.append(f"[{med}] Route rejected: {donor['hospital']} -> {target['hospital']} ({actual_time}m > {specs['max_time']}m {specs['type']} limit).")
                    continue
                    
                if actual_time < lowest_cost:
                    lowest_cost = actual_time
                    best_route = {
                        "medicine": med, "from": donor["hospital"], "to": target["hospital"],
                        "base_time": int(base_time), "traffic_delay": int(actual_time - base_time),
                        "total_time": actual_time, "confidence": "High" if traffic_multiplier < 1.2 else "Moderate"
                    }
            
            if best_route:
                daily_routes.append(best_route)
                daily_logs.append(f"[{med}] Emergency dispatch: {best_route['from']} -> {best_route['to']}.")
                
                transfer_amt = 250
                system_state[best_route['from']][med]["stock"] -= transfer_amt
                system_state[best_route['to']][med]["stock"] += transfer_amt

    total_deficits = sum(1 for n in daily_nodes for m in medicines if n["inventory"][m]["status"] == "Critical Deficit")
    total_surpluses = sum(1 for n in daily_nodes for m in medicines if n["inventory"][m]["status"] == "Surplus")
    
    if total_deficits > 15 and total_surpluses == 0:
         daily_logs.append(f">> CRITICAL SYSTEM FAILURE: INSUFFICIENT NETWORK SURPLUS TO HALT CASCADE.")

    simulation_timeline.append({
        "day": day, "date": current_date_str, "nodes": daily_nodes, "routes": daily_routes, "logs": daily_logs
    })

with open("src/data/liveDashboardData.json", "w") as f:
    json.dump(simulation_timeline, f, indent=4)