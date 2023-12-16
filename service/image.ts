import sharp from 'sharp'
// @ts-ignore
import * as magic from 'detect-file-type'

export type Attachment = {
  attachment: Buffer
  name: string
}

async function getExtension(imageBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    magic.default.fromBuffer(imageBuffer, (err: any, result: any) => {
      if (err) reject(err.message)
      else resolve(result.ext)
    })
  })
}

async function makeImageBody(
  attachment: Buffer,
  name: string
): Promise<Attachment> {
  return {
    attachment,
    name: `${name}.${await getExtension(attachment)}`,
  }
}

export function generateMedia(imageBuffer: Buffer): Promise<Attachment> {
  return makeImageBody(imageBuffer, 'media')
}

export async function generateAvatar(
  imageBuffer: Buffer,
  size: number
): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    sharp(imageBuffer)
      .resize({
        fit: 'cover',
        width: size,
        height: size,
      })
      .webp({ quality: 75 })
      .toBuffer((err, buffer) => {
        if (err) reject(err.message)
        else makeImageBody(buffer, 'avatar').then(resolve)
      })
  })
}

export async function generateThumbnail(
  imageBuffer: Buffer
): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    sharp(imageBuffer)
      .resize({
        withoutEnlargement: true,
        fit: 'inside',
        width: 768,
        height: 768,
      })
      .webp({ quality: 75 })
      .toBuffer((err, buffer) => {
        if (err) reject(err.message)
        else makeImageBody(buffer, 'thumbnail').then(resolve)
      })
  })
}