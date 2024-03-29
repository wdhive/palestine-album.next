import { Collection, Media, MediaCategory, User } from '@prisma/client'
import { NextRequest } from 'next/server'
import { NextFunction } from 'router13'
import config from './config'
import { Prettify, PrettifyPick } from './utils'

type NextCtx = {
  params: Record<string, string | undefined>
  body<B = unknown>(): B
  query<Q = unknown>(): Prettify<Partial<Q>>
}

export type NextHandler<TCtx = {}> = (
  req: Omit<NextRequest, 'json' | 'body'>,
  ctx: Prettify<Omit<NextCtx, keyof TCtx> & TCtx>,
  next: NextFunction
) => any

export type NextUserHandler<T = {}> = NextHandler<{ user: User } & T>
export type NextOptUserHandler<T = {}> = NextHandler<{ user?: User } & T>
export type NextUserMediaHandler<T = {}> = NextUserHandler<
  {
    media: MediaWithReactionCountRaw
    relatedMedia?: MediaWithReactionCountRaw[]
  } & T
>

export type MediaWithReactionCountRaw = Media & {
  author: PrettifyPick<User, (typeof config.user.publicFields)[number]>
  category: MediaCategory | null
  _count: {
    reactions: number
  }
}

export type MediaWithReactionCount = Omit<
  MediaWithReactionCountRaw,
  'storageRecordId'
>

export type MediaWithLoves = MediaWithReactionCount & {
  isLoved: boolean
}

export type CollectionWithMediaCount = Collection & {
  _count: { media: number }
}

export type CollectionWithRawMedia = Collection & {
  media: MediaWithReactionCountRaw[]
}

export type CollectionWithMedia = Collection & {
  media: (MediaWithReactionCount | null)[]
}

export type JWTPayload = {
  auth: string
  cookie: string
  'service-token-outer': string
  'service-token-inner': boolean
  'signup-email': string
  'change-email': {
    userId: string
    newEmail: string
  }
  'public-email': {
    userId: string
    profileEmail: string
  }
  'reset-password': {
    userId: string
    email: string
  }
}
