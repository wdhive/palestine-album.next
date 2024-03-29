import { authRouter } from '@/server/router'
import service from '@/service'
import { UpdateReportBody } from '@/service/model/media'
import { MediaReport } from '@prisma/client'
import { NextResponse } from 'next/server'

export type PatchBody = Omit<UpdateReportBody, 'status'>
export type PatchData = { report: MediaReport }
export const PATCH = authRouter(async (req, ctx) => {
  const report = await service.media.updateReport(
    ctx.params.reportId!,
    ctx.user,
    { ...ctx.body<PatchBody>() }
  )

  return NextResponse.json<PatchData>({ report })
})

export const DELETE = authRouter(async (_, ctx) => {
  await service.media.deleteReport(ctx.user, ctx.params.reportId!)
  return NextResponse.json(null)
})
