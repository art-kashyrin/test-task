import type { CityStat } from '../hooks/use-city-stats'

interface CityStatsTableProps {
  items: CityStat[]
}

export function CityStatsTable({ items }: CityStatsTableProps) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="py-2 pr-4 font-medium text-gray-500">City</th>
          <th className="py-2 font-medium text-gray-500">Registered users</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.city} className="border-b border-gray-100">
            <td className="py-2 pr-4 text-gray-900">{item.city}</td>
            <td className="py-2 text-gray-900">{item.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
