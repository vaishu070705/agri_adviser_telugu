import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  data: Array<{ name: string; count: number }>;
  colors: string[];
}

export default function DashboardDiseaseChart({ data, colors }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" tick={{ fontSize: 10 }} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
        <Tooltip />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
