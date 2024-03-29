import { onlyAdmin } from '@/server/middlewares/auth'
import { authRouter } from '@/server/router'
import service from '@/service'
import config from '@/service/config'
import { ChangeStatusBody } from '@/service/model/user'
import { PrettifyPick, pick } from '@/service/utils'
import { User } from '@prisma/client'
import { NextResponse } from 'next/server'

export type PatchBody = ChangeStatusBody
export type PatchData = {
  user: PrettifyPick<User, (typeof config.user.publicFields)[number]>
}

export const PATCH = authRouter(onlyAdmin, async (_, ctx, next) => {
  const userId = ctx.params.userId!
  const user = await service.user.changeStatus(ctx.user, userId, ctx.body())
  return NextResponse.json<PatchData>({
    user: pick(user, ...config.user.publicFields),
  })
})
