import { MediaWithLoves } from '@/service/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar'
import { Badge } from '@/shadcn/ui/badge'
import { Button, buttonVariants } from '@/shadcn/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shadcn/ui/hover-card'
import { joinUrl } from '@/util'
import { Bookmark, Download, Heart } from 'lucide-react'
import Link from 'next/link'

export function PhotoCard({
  url_thumbnail,
  url_media,
  title,
  author,
  createdAt,
  media_height,
  media_width,
  description,
  tags,
}: MediaWithLoves) {
  return (
    <div className="stack-content group cursor-pointer rounded overflow-hidden shadow shadow-muted">
      <Link href="#">
        <img
          src={`/api/yandex-disk/media/${url_thumbnail}`}
          alt={`${title}`}
          loading="lazy"
          className="w-full"
          style={{ aspectRatio: `${media_width} / ${media_height}` }}
        />
      </Link>
      <div className="flex opacity-0 mt-auto group-hover:opacity-100 transition-opacity duration-300 flex-col justify-between p-4 pointer-events-none">
        <div className="flex gap-1 justify-end"></div>
        <div className="flex gap-1 justify-between font-sans">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link
                href="#"
                className="font-sm font-semibold text-foreground group-hover:pointer-events-auto"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={author.avatar_sm ?? undefined} />
                  <AvatarFallback>
                    {author.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-display">{author.name}</span>
                  <span className="text-muted-foreground">
                    {new Date(createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {(title || description) && (
                  <p className="flex flex-col">
                    <span>{title}</span>
                    <span className="text-muted-foreground">{description}</span>
                  </p>
                )}

                <div className="flex gap-1 flex-wrap">
                  {tags.slice(0, 5).map((tag, i) => (
                    <Badge key={tag + i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="flex flex-row-reverse gap-2">
            <a
              href={joinUrl(
                process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000',
                'api/yandex-disk/media',
                url_media
              )}
              download
              className={buttonVariants({
                size: 'icon',
                className: 'group-hover:pointer-events-auto',
              })}
            >
              <Download />
            </a>
            <Button size="icon" className="group-hover:pointer-events-auto">
              <Bookmark />
            </Button>
            <Button size="icon" className="group-hover:pointer-events-auto">
              <Heart />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
