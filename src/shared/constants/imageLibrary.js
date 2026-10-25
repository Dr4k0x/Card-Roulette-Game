import { imageOption } from '../utils/imageOption.js'

const images = import.meta.glob('/src/assets/image-mode-library/**/*.{png,jpg,jpeg,webp,avif,gif,svg,PNG,JPG,JPEG,WEBP,AVIF,GIF,SVG}', {
  eager: true, query: '?url', import: 'default',
})

export const IMAGE_LIBRARY = Object.entries(images)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([path, url]) => imageOption(path, url))
