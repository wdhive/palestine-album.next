'use client'

import { Password } from '@/components/form/password'
import { useAuth } from '@/hooks'
import { GoogleIcon, SpinnerIcon } from '@/icons'
import { Button } from '@/shadcn/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shadcn/ui/form'
import { Input } from '@/shadcn/ui/input'
import { cn } from '@/shadcn/utils'
import { emailRegex } from '@/util'
import googleAuth from '@/util/google'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface UserSigninFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface FormValues {
  email: string
  password: string
}

export function UserSigninForm({ className, ...props }: UserSigninFormProps) {
  const { signIn } = useAuth()
  const router = useRouter()
  const qp = useSearchParams()
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(value: FormValues) {
    const [_, error] = await signIn(value)

    if (error) return toast.error('Invalid email and password!')
    toast.success('Welcome back, nice to see you again!')

    return router.replace(qp.get('callbackURL') ?? '/')
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  message: 'Please enter a valid email address',
                  value: emailRegex,
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  message: 'Password must be at least 6 characters',
                  value: 6,
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Password placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Signin
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={() => googleAuth()}>
        <GoogleIcon className="mr-2 h-4 w-4" /> Google
      </Button>
    </div>
  )
}