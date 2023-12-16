import {
  USER_SAFE_FIELDS_QUERY,
  USER_PUBLIC_FIELDS_QUERY,
} from '../../service/config'
import db from '../../service/db'
import { Response } from 'express'
import { UserRequest } from './middleware'
import ReqErr from '../../service/ReqError'
import { mediaInputSchema } from './config'
import discord from '../../service/discord'
import { MediaWithLoves } from '../../service/types'

export async function createMedia(req: UserRequest, res: Response) {
  const buffer = req.file?.buffer
  if (!buffer) throw new ReqErr('No file provided')
  const body = mediaInputSchema.parse(req.body)
  if (body.newCategory && body.categoryId) {
    throw new ReqErr('Cannot provide both newCategory and categoryId')
  }

  if (body.categoryId) {
    await db.mediaCategory.findUniqueOrThrow({
      where: { id: body.categoryId },
    })
  }

  if (req.user.role === 'ADMIN' || req.user.role === 'MODERATOR') {
    if (body.newCategory) {
      const name = body.newCategory.toLowerCase()
      const category =
        (await db.mediaCategory.findFirst({ where: { name } })) ??
        (await db.mediaCategory.create({ data: { name } }))

      body.categoryId = category.id
    }

    body.status = 'APPROVED'
    body.status_approvedAt = new Date()
    body.status_moderatedAt = new Date()
    body.status_moderatedById = req.user.id
    delete body.newCategory
    delete body.note
  }

  const result = await discord.uploadMedia(buffer)
  const media = await db.media.create({
    data: {
      ...body,

      authorId: req.user.id,
      messageId: result.id,

      media_size: result.media.size,
      media_width: result.media.width,
      media_height: result.media.height,

      url_media: result.media.url,
      url_thumbnail: result.thumbnail.url,
    },
    include: {
      author: { select: USER_PUBLIC_FIELDS_QUERY },
      category: true,
    },
  })

  const data: MediaWithLoves = { ...media, isLoved: false, loves: 0 }
  res.json({ data })
}

export async function postAvatar(req: UserRequest, res: Response) {
  const buffer = req.file?.buffer
  if (!buffer) throw new ReqErr('No file provided')
  if (req.file!.size > 1024 * 1024 * 5 /* 5 MB */) {
    throw new ReqErr('Max file size is 5 MB')
  }

  const result = await discord.uploadAvatar(buffer)
  const user = await db.user.update({
    where: { id: req.user.id },
    data: {
      avatarId: result.id,
      avatar_sm: result.avatar_sm.url,
      avatar_md: result.avatar_md.url,
      avatar_lg: result.avatar_lg.url,
    },
    select: USER_SAFE_FIELDS_QUERY,
  })

  res.json({ user })
  if (req.user.avatarId) {
    await discord.deleteAvatar(req.user.avatarId).catch(console.error)
  }
}