"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
      return <div className="h-full flex items-center justify-center text-gray-400 font-bold">No Data Available</div>;
  }

  return (
    // FIX: Height '100%' le raha hai parent container ka
    <div className="w-full h-full pt-4"> 
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000000" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 11, fill: '#9CA3AF', fontWeight: '600'}} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 11, fill: '#9CA3AF', fontWeight: '600'}} 
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', borderRadius: '12px', border: 'none', color: '#fff', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)' }}
            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
            cursor={{ stroke: '#E5E7EB', strokeWidth: 2 }}
            formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#000000" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSales)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}