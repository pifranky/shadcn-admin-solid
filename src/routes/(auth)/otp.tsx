import { createFileRoute } from '@tanstack/solid-router'
import { Otp } from '@/features/auth/otp'

export const Route = createFileRoute('/(auth)/otp')({
  component: Otp,
})
