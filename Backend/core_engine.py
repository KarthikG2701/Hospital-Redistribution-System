import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta

hospitals = [
    "Victoria Hospital", "Aster CMI (Hebbal)", "Manipal Hospital (HAL)", 
    "Apollo (Jayanagar)", "Fortis (Bannerghatta)", "NIMHANS",
    "St. John's Medical", "Ramaiah Memorial", "Narayana Health", "BGS Gleneagles"
]

# Slightly relaxed cold-chain limits to ensure OSRM math allows cross-city routes
medicines = {
    "Amoxicillin": {"max_time": 120},
    "Insulin": {"max_time": 90}, 
    "O-Negative Blood": {"max_time": 60},
    "Azithromycin": {"max_time": 120},
    "Propofol": {"max_time": 60}
}

# Fixed transit matrix to guarantee routes succeed (15 to 45 mins)
base_osrm = pd.DataFrame(np.random.randint(15, 45, size=(10, 10)), index=hospitals, columns=hospitals)
np.fill_diagonal(base_osrm.values, 0)

# 1. Staged Cascade Roles
# We explicitly define who fails when, and who has the surplus to help
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

    # THE SYSTEMIC SHOCK (Day 4)
    if day == 4:
        daily_logs.append(">> SYS.ALERT: REGIONAL SURGE DETECTED. MASS CASUALTY INCIDENT IN SOUTHERN SECTOR.")
        for h in hospitals:
            if roles[h]["role"] == "Vulnerable":
                for med in medicines:
                    system_state[h][med]["drain"] += 55 # Massive spike that will destroy 7-day projections

    for h in hospitals:
        hosp_data = {"hospital": h, "inventory": {}}
        for med in medicines:
            if day > 0:
                # Subtract daily drain
                actual_drain = int(np.random.normal(system_state[h][med]["drain"], system_state[h][med]["drain"] * 0.1))
                system_state[h][med]["stock"] = max(0, system_state[h][med]["stock"] - actual_drain)

            curr_stock = system_state[h][med]["stock"]
            drain_rate = system_state[h][med]["drain"]

            # 7-day forecast
            forecast = []
            sim_stock = curr_stock
            for i in range(15):
                f_date = (today + timedelta(days=day+i)).strftime('%b %d')
                forecast.append({"date": f_date, "projected_stock": max(0, sim_stock)})
                sim_stock -= drain_rate

            stock_day_7 = forecast[7]["projected_stock"]
            days_to_stockout = curr_stock // drain_rate if drain_rate > 0 else 99

            # STRICT Visual Thresholds
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

    # 3. Routing & Replenishment (The Exhaustion Mechanic)
    for med, specs in medicines.items():
        deficits = [n for n in daily_nodes if n["inventory"][med]["status"] == "Critical Deficit"]
        surpluses = [n for n in daily_nodes if n["inventory"][med]["status"] == "Surplus"]
        
        for target in deficits:
            best_route = None
            lowest_cost = float('inf')
            
            for donor in surpluses:
                # Prevent donors from going negative in a single loop
                if system_state[donor["hospital"]][med]["stock"] < 300:
                    continue
                    
                base_time = base_osrm.loc[donor["hospital"], target["hospital"]]
                traffic_multiplier = round(np.random.uniform(1.0, 1.4), 2)
                actual_time = int(base_time * traffic_multiplier)
                
                if actual_time > specs["max_time"]:
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
                
                # Deduct 250 units! This will quickly drain the donors, destroying their "Surplus" status
                transfer_amt = 250
                system_state[best_route['from']][med]["stock"] -= transfer_amt
                system_state[best_route['to']][med]["stock"] += transfer_amt

    # Log the system collapse
    total_deficits = sum(1 for n in daily_nodes for m in medicines if n["inventory"][m]["status"] == "Critical Deficit")
    total_surpluses = sum(1 for n in daily_nodes for m in medicines if n["inventory"][m]["status"] == "Surplus")
    
    if total_deficits > 15 and total_surpluses == 0:
         daily_logs.append(f">> CRITICAL SYSTEM FAILURE: INSUFFICIENT NETWORK SURPLUS TO HALT CASCADE.")

    simulation_timeline.append({
        "day": day, "date": current_date_str, "nodes": daily_nodes, "routes": daily_routes, "logs": daily_logs
    })

with open("src/data/liveDashboardData.json", "w") as f:
    json.dump(simulation_timeline, f, indent=4)