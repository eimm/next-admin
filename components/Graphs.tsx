"use client";

import { GraphData } from "@/app/(dashboard)/[storeId]/(routes)/actions";
import React, { FC } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface GraphsProps {
  data: GraphData[];
}

const Graphs: FC<GraphsProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#d3d3d3"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#d3d3d3"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill="#00ff00" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Graphs;
