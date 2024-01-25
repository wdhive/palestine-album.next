import { NextResponse } from 'next/server'
import service from '@/service'
import { optionalAuthRouter } from '@/server/router'
import { MediaListOptions } from '@/service/model/media'
import { addLovesToMedia } from '@/service/model/media/helpers'
import { MediaWithLoves } from '@/service/types'

export type GetQuery = Partial<
  Record<keyof MediaListOptions, string> & Pick<MediaListOptions, 'status'>
>
export type GetData = {
  mediaList: MediaWithLoves[]
}
export const GET = optionalAuthRouter(async (req, ctx) => {
  const mediaList = await service.media.getLatestMediaList(
    ctx.user,
    ctx.query<GetQuery>()
  )

  return NextResponse.json<GetData>({
    mediaList: await addLovesToMedia(mediaList, ctx.user?.id),
  })
})
