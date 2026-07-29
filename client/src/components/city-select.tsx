import { useMemo } from 'react'
import { Field } from '@base-ui/react/field'
import { Select } from '@base-ui/react/select'
import type { City } from '../hooks/use-cities'

interface CitySelectProps {
  label: string
  cities: City[]
  value: string | null
  onValueChange: (value: string | null) => void
  errorMessage?: string
}

export function CitySelect({ label, cities, value, onValueChange, errorMessage }: CitySelectProps) {
  const items = useMemo(
    () => cities.map((city) => ({ value: String(city.id), label: city.displayName })),
    [cities],
  )

  return (
    <Field.Root className="flex flex-col gap-1" invalid={errorMessage !== undefined}>
      <Field.Label className="text-sm font-medium text-gray-700">{label}</Field.Label>
      <Select.Root items={items} value={value} onValueChange={onValueChange}>
        <Select.Trigger className="flex w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <Select.Value placeholder="Select a city" />
          <Select.Icon className="text-gray-400">▾</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className="z-10" sideOffset={4}>
            <Select.Popup className="max-h-64 overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              <Select.List>
                {cities.map((city) => (
                  <Select.Item
                    key={city.id}
                    value={String(city.id)}
                    className="cursor-pointer px-3 py-2 text-sm data-[highlighted]:bg-blue-50"
                  >
                    <Select.ItemText>{city.displayName}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      {errorMessage !== undefined && (
        <Field.Error match className="text-sm text-red-600">
          {errorMessage}
        </Field.Error>
      )}
    </Field.Root>
  )
}
