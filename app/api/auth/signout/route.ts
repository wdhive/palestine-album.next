import { router } from '@/server/router'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const DELETE = router(async () => {
  cookies().delete('authorization')
  return NextResponse.json(null)
})
