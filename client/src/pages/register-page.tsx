import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { CitySelect } from '../components/city-select'
import { TextField } from '../components/text-field'
import { useCities } from '../hooks/use-cities'
import { useRegister } from '../hooks/use-register'

interface RegisterFormValues {
  name: string
  surname: string
  city: string | null
  password: string
  confirmPassword: string
}

export function RegisterPage() {
  const citiesQuery = useCities()
  const registerMutation = useRegister()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: { name: '', surname: '', city: null, password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit((values) => {
    setFormError(null)
    if (values.city === null) {
      setError('city', { message: 'City is required' })
      return
    }
    registerMutation.mutate(
      {
        body: {
          name: values.name,
          surname: values.surname,
          city: Number(values.city),
          password: values.password,
        },
      },
      {
        onSuccess: () => {
          void navigate('/login', { state: { registered: true } })
        },
        onError: (error) => {
          if (error.statusCode === 409) {
            setError('name', { message: error.message })
            return
          }
          setFormError(error.message)
        },
      },
    )
  })

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Create an account</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <TextField
          label="Name"
          errorMessage={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Must be at least 2 characters' },
          })}
        />
        <TextField
          label="Surname"
          errorMessage={errors.surname?.message}
          {...register('surname', {
            required: 'Surname is required',
            minLength: { value: 2, message: 'Must be at least 2 characters' },
          })}
        />
        <Controller
          name="city"
          control={control}
          rules={{ required: 'City is required' }}
          render={({ field, fieldState }) => (
            <CitySelect
              label="City"
              cities={citiesQuery.data ?? []}
              value={field.value}
              onValueChange={field.onChange}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
        <TextField
          label="Password"
          type="password"
          errorMessage={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Must be at least 8 characters' },
          })}
        />
        <TextField
          label="Confirm password"
          type="password"
          errorMessage={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value, formValues) =>
              value === formValues.password || 'Passwords must match',
          })}
        />
        {formError !== null && <p className="text-sm text-red-600">{formError}</p>}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Create account
        </button>
      </form>
      <p className="text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
