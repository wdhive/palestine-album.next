import { NextResponse } from 'next/server'
import service from '@/service'
import { optionalAuthRouter } from '@/server/router'
import { MediaListOptions } from '@/service/model/media'
import { addLovesToMedia } from '@/service/model/media/helpers'
import { MediaWithLoves } from '@/service/types'

export type GetQuery = Omit<
  Partial<
    Record<keyof MediaListOptions, string> & Pick<MediaListOptions, 'status'>
  >,
  'status' | 'updateRequest'
>

export type GetData = {
  mediaList: MediaWithLoves[]
}

export const GET = optionalAuthRouter(async (_, ctx) => {
  const query = ctx.query<GetQuery>()
  const mediaList = await service.media.getLatestMediaList({
    ...query,
    status: 'APPROVED',
    updateRequest: false,
  })

  return NextResponse.json<GetData>({
    mediaList: await addLovesToMedia(mediaList, ctx.user?.id),
  })
})
