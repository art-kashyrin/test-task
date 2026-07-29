import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { TextField } from '../components/text-field'
import { useAuth } from '../hooks/use-auth'
import { useLogin } from '../hooks/use-login'

interface LoginFormValues {
  name: string
  password: string
}

interface LoginLocationState {
  registered?: boolean
}

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const loginMutation = useLogin()
  const [formError, setFormError] = useState<string | null>(null)

  const state = location.state as LoginLocationState | null
  const registered = state?.registered === true

  const onSubmit = handleSubmit((values) => {
    setFormError(null)
    loginMutation.mutate(
      { body: values },
      {
        onSuccess: (result) => {
          login(result.accessToken)
          void navigate('/users', { replace: true })
        },
        onError: (error) => {
          setFormError(error.message)
        },
      },
    )
  })

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Sign in</h1>
      {registered && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Account created — please sign in
        </p>
      )}
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <TextField
          label="Name"
          errorMessage={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <TextField
          label="Password"
          type="password"
          errorMessage={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />
        {formError !== null && <p className="text-sm text-red-600">{formError}</p>}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Sign in
        </button>
      </form>
      <p className="text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  )
}
