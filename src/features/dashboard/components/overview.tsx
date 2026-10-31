import { BarChart } from '@/components/charts/bar-chart'

const data = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
].map((name) => ({
  name,
  value: Math.floor(Math.random() * 5000) + 1000,
}))

export function Overview() {
  return (
    <BarChart
      data={data}
      height={350}
      tickFormatter={(value) => `$${value}`}
      barClass='fill-primary'
    />
  )
}
