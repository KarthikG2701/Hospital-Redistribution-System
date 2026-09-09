import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Droplet } from 'lucide-react';

export default function BloodLiquidityTable() {
  const bloodInventory = useDashboardStore((state) => state.bloodInventory);
  const transferBlood = useDashboardStore((state) => state.transferBlood);

  return (
    <Card className="col-span-12 lg:col-span-6 bg-slate-900 border-slate-800 text-white">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Droplet className="text-red-500 h-5 w-5" />
          eRaktKosh Blood Liquidity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-800/50">
              <TableHead className="text-slate-400">Hospital</TableHead>
              <TableHead className="text-slate-400">Type</TableHead>
              <TableHead className="text-slate-400">Units</TableHead>
              <TableHead className="text-slate-400">Expires In</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bloodInventory.map((item) => (
              <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-medium">{item.hospital}</TableCell>
                <TableCell className="text-red-400 font-bold">{item.type}</TableCell>
                <TableCell>{item.units}</TableCell>
                <TableCell>{item.expires_in_days} Days</TableCell>
                <TableCell>
                  <Badge 
                    variant={item.status === 'Critical' ? 'destructive' : 'secondary'}
                    className={item.status === 'Critical' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border-none' : 'bg-slate-800 text-slate-300 border-none'}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {/* Clicking this fires the Zustand action we wrote earlier! */}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
                    onClick={() => transferBlood(item.id)}
                  >
                    Request
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}