import { Link, useSearch } from '@tanstack/solid-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const search = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card class='max-w-sm gap-4'>
        <CardHeader>
          <CardTitle class='text-lg tracking-tight'>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password below to log into{' '}
            <br class='max-sm:hidden' /> your account. Don't have an account?{' '}
            <Link
              to='/sign-up'
              class='text-nowrap underline underline-offset-4 hover:text-primary'
            >
              Sign Up
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={search().redirect} />
        </CardContent>
        <CardFooter>
          <p class='px-8 text-center text-sm text-muted-foreground'>
            By clicking sign in, you agree to our{' '}
            <a
              href='/terms'
              class='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              class='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
