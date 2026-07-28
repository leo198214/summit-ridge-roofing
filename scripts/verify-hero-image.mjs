import { stat } from 'node:fs/promises'

const asset = new URL('../public/roof-hero.webp', import.meta.url)
const info = await stat(asset)
if (info.size < 25_000) {
  throw new Error(`roof-hero.webp is unexpectedly small: ${info.size} bytes`)
}
console.log(`Verified local hero asset: ${info.size} bytes`)
