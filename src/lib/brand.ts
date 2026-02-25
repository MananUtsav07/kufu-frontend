const assetModules = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const assetEntries = Object.entries(assetModules)

const pickAsset = (matcher: (assetPath: string) => boolean): string | undefined =>
  assetEntries.find(([assetPath]) => matcher(assetPath.toLowerCase()))?.[1]

const preferredLogo =
  pickAsset((assetPath) => assetPath.endsWith('/kufu-logo.png')) ??
  pickAsset((assetPath) => /\/kufu-logo\.(png|jpg|jpeg|webp|avif|svg)$/.test(assetPath)) ??
  pickAsset((assetPath) => /\/kufu.*\.(png|jpg|jpeg|webp|avif|svg)$/.test(assetPath)) ??
  pickAsset((assetPath) => !assetPath.endsWith('/react.svg')) ??
  assetEntries[0]?.[1] ??
  ''

const preferredChatLogo =
  pickAsset((assetPath) => assetPath.endsWith('/small-logo.png')) ??
  pickAsset((assetPath) => /\/small-logo\.(png|jpg|jpeg|webp|avif|svg)$/.test(assetPath)) ??
  preferredLogo

export const brandName = 'Kufu'
export const brandLogoSrc = preferredLogo
export const brandChatLogoSrc = preferredChatLogo
