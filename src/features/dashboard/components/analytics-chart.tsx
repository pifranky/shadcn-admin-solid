import { AreaChart } from '@/components/charts/area-chart'

const data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name) => ({
  name,
  clicks: Math.floor(Math.random() * 900) + 100,
  uniques: Math.floor(Math.random() * 700) + 80,
}))

export function AnalyticsChart() {
  return (
    <AreaChart
      data={data}
      xKey='name'
      height={300}
      series={[
        { key: 'clicks', class: 'text-primary', fillOpacity: 0.15 },
        { key: 'uniques', class: 'text-muted-foreground', fillOpacity: 0.1 },
      ]}
    />
  )
}
