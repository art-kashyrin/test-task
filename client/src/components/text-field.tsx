import { forwardRef, type ComponentPropsWithRef } from 'react'
import { Field } from '@base-ui/react/field'
import { Input } from '@base-ui/react/input'

interface TextFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'className'> {
  label: string
  errorMessage?: string
}

export const TextField = forwardRef<HTMLElement, TextFieldProps>(function TextField(
  { label, errorMessage, id, ...inputProps },
  ref,
) {
  return (
    <Field.Root className="flex flex-col gap-1" invalid={errorMessage !== undefined}>
      <Field.Label className="text-sm font-medium text-gray-700">{label}</Field.Label>
      <Input
        ref={ref}
        id={id}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        {...inputProps}
      />
      {errorMessage !== undefined && (
        <Field.Error match className="text-sm text-red-600">
          {errorMessage}
        </Field.Error>
      )}
    </Field.Root>
  )
})
