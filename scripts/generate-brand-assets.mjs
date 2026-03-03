import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import pngToIco from 'png-to-ico'
import sharp from 'sharp'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(currentDir, '..')
const assetsDir = path.join(projectRoot, 'src', 'assets')
const publicDir = path.join(projectRoot, 'public')

const imagePattern = /\.(png|jpe?g|webp|avif|svg)$/i

const pickLogoFile = (fileNames) => {
  const normalized = fileNames.filter((fileName) => imagePattern.test(fileName))
  const lowerCaseNames = normalized.map((fileName) => ({
    fileName,
    lowerCaseName: fileName.toLowerCase(),
  }))

  const pick = (matcher) => lowerCaseNames.find(({ lowerCaseName }) => matcher(lowerCaseName))?.fileName

  return (
    pick((name) => name === 'newlogo.png') ??
    pick((name) => /^newlogo\.(png|jpg|jpeg|webp|avif|svg)$/.test(name)) ??
    pick((name) => /^officiallogo\.(png|jpg|jpeg|webp|avif|svg)$/.test(name)) ??
    pick((name) => name === 'kufu-logo.png') ??
    pick((name) => /^kufu-logo\.(png|jpg|jpeg|webp|avif|svg)$/.test(name)) ??
    pick((name) => /^kufu.*\.(png|jpg|jpeg|webp|avif|svg)$/.test(name)) ??
    pick((name) => name !== 'react.svg') ??
    normalized[0]
  )
}

const resolveLogoPath = async () => {
  const fileNames = await fs.readdir(assetsDir)
  const logoFile = pickLogoFile(fileNames)

  if (!logoFile) {
    throw new Error(`No image file found in ${assetsDir}`)
  }

  return path.join(assetsDir, logoFile)
}

const writeFavicons = async (logoPath) => {
  const transparent = { r: 0, g: 0, b: 0, alpha: 0 }

  const favicon16 = await sharp(logoPath)
    .resize(16, 16, { fit: 'contain', background: transparent })
    .png()
    .toBuffer()
  const favicon32 = await sharp(logoPath)
    .resize(32, 32, { fit: 'contain', background: transparent })
    .png()
    .toBuffer()
  const favicon64 = await sharp(logoPath)
    .resize(64, 64, { fit: 'contain', background: transparent })
    .png()
    .toBuffer()

  await fs.writeFile(path.join(publicDir, 'favicon-16x16.png'), favicon16)
  await fs.writeFile(path.join(publicDir, 'favicon-32x32.png'), favicon32)

  const faviconIco = await pngToIco([favicon16, favicon32, favicon64])
  await fs.writeFile(path.join(publicDir, 'favicon.ico'), faviconIco)
}

const writeOpenGraphImage = async (logoPath) => {
  const logoBuffer = await sharp(logoPath)
    .resize({
      width: 560,
      height: 240,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png()
    .toBuffer()

  const logoMetadata = await sharp(logoBuffer).metadata()
  const logoWidth = logoMetadata.width ?? 0
  const logoHeight = logoMetadata.height ?? 0

  const ogWidth = 1200
  const ogHeight = 630

  const left = Math.max(0, Math.floor((ogWidth - logoWidth) / 2))
  const top = Math.max(0, Math.floor((ogHeight - logoHeight) / 2))

  await sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 4,
      background: '#101222',
    },
  })
    .composite([
      {
        input: logoBuffer,
        left,
        top,
      },
    ])
    .png()
    .toFile(path.join(publicDir, 'og.png'))
}

const main = async () => {
  await fs.mkdir(publicDir, { recursive: true })

  const logoPath = await resolveLogoPath()
  console.log(`[brand-assets] using logo source: ${path.relative(projectRoot, logoPath)}`)

  await writeFavicons(logoPath)
  await writeOpenGraphImage(logoPath)

  console.log('[brand-assets] generated favicon.ico, favicon-32x32.png, favicon-16x16.png, og.png')
}

void main().catch((error) => {
  console.error('[brand-assets] failed to generate assets')
  console.error(error)
  process.exit(1)
})
