import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { inventoryData } from "../data/predictiveMockData";

export default function MedicineInventoryMatrix() {
  return (
    <Card className="col-span-2 bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-emerald-400 text-lg tracking-wider">MEDICINE INVENTORY MATRIX</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-gray-400">Facility</TableHead>
              <TableHead className="text-gray-400">Medicine</TableHead>
              <TableHead className="text-gray-400 text-right">Current Stock</TableHead>
              <TableHead className="text-gray-400 text-right">Daily Consumption</TableHead>
              <TableHead className="text-gray-400 text-right">Days on Hand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData.map((row) => (
              <TableRow key={row.id} className="border-gray-800">
                <TableCell className="font-medium">{row.facility}</TableCell>
                <TableCell>{row.medicine}</TableCell>
                <TableCell className="text-right">{row.stock}</TableCell>
                <TableCell className="text-right">{row.dailyConsumption}</TableCell>
                <TableCell className={`text-right font-bold ${row.daysOnHand <= 3 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {row.daysOnHand}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}