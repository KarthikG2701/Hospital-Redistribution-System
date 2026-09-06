import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { alerts } from "../data/predictiveMockData";

export default function InterventionAlerts() {
  return (
    <Card className="col-span-1 bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-red-400 text-lg tracking-wider">PRIORITIZED ACTIONS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-4 border rounded-md ${alert.priority === 'CRITICAL' ? 'bg-red-950/20 border-red-900/50' : 'bg-yellow-950/20 border-yellow-900/50'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs font-bold px-2 py-1 rounded ${alert.priority === 'CRITICAL' ? 'bg-red-900 text-red-200' : 'bg-yellow-900 text-yellow-200'}`}>
                {alert.priority}
              </span>
              <span className="text-xs text-gray-400 font-mono">{alert.facility}</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{alert.message}</p>
            <button className="w-full text-xs font-mono py-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700">
              EXECUTE: {alert.action}
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}