import { UserCompleteForm } from '@/components/user-complete-form'
import sdk from '@/sdk'
import { buttonVariants } from '@/shadcn/ui/button'
import { cn } from '@/shadcn/utils'
import { ArrowLeftIcon } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'complete signup',
}

export default async function Complete({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const [response] = await sdk.auth.checkAuth()

  const _currentUser = response?.user ?? null
  const _auth = response?.token ?? null

  if (_currentUser && _auth) redirect(searchParams.callbackURL ?? '/')

  return (
    <div className="bg-background">
      <div className="flex min-h-screen [&>*]:flex-1 ">
        <div className="stack-content min-h-full hidden lg:grid border-r w-full rounded-r-lg overflow-hidden">
          <Image
            src="https://source.unsplash.com/random/1280x843"
            width={843}
            height={1280}
            alt="random"
            className="w-full h-full object-cover select-none dragging-none"
          />
        </div>
        <div className="relative min-h-full p-4">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'absolute right-4 top-4 md:right-8 md:top-8'
            )}
          >
            Signup
          </Link>

          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'absolute left-4 top-4 md:left-8 md:top-8'
            )}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <div className="flex items-center justify-center max-w-lg mx-auto h-full">
            <div className="flex w-full flex-col justify-center space-y-6 ">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Complete your account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your password below to create your account
                </p>
              </div>
              <UserCompleteForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}