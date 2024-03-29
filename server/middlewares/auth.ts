import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import config from '@/service/config'
import * as hash from '@/service/hash'
import { NextUserHandler } from '@/service/types'
import { pick } from '@/service/utils'
import ReqErr from '@/service/ReqError'
import { User } from '@prisma/client'
import { userPermissionFactory } from '@/service/model/helpers'

export type SendUserAndTokenData = {
  user: Pick<User, (typeof config.user.safeFields)[number]> & {}
  jwt_token: string
}

export const sendUserAndToken: NextUserHandler<{
  response?: Record<string, any>
}> = async (_, ctx) => {
  const cookieToken = await hash.jwt.sign('cookie', ctx.user.id)
  const authToken = await hash.jwt.sign('auth', ctx.user.id)

  cookies().set({
    name: 'authorization',
    value: cookieToken,
    path: '/',
    httpOnly: true,
    maxAge: Date.now() + 86400000 * 30,
  })

  return NextResponse.json<SendUserAndTokenData>({
    ...ctx.response,
    user: {
      ...pick(ctx.user, ...config.user.safeFields),
    },
    jwt_token: authToken,
  })
}

export const checkPassword: NextUserHandler<{}> = async (_, ctx, next) => {
  const body = ctx.body<{ password: string }>()
  if (!body.password) {
    throw new ReqErr('Password is required')
  }

  if (await hash.bcrypt.compare(body.password, ctx.user.password)) {
    return next()
  }

  throw new ReqErr('Password is incorrect')
}

export const onlyAdmin: NextUserHandler<{}> = async (_, ctx, next) => {
  if (userPermissionFactory(ctx.user).isAdmin) {
    return next()
  }

  throw new ReqErr('You need to be an admin to do this')
}

export const onlyModerator: NextUserHandler<{}> = async (_, ctx, next) => {
  if (userPermissionFactory(ctx.user).isModeratorLevel) {
    return next()
  }

  throw new ReqErr('You need to be a moderator to do this')
}
