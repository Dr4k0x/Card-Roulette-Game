import { OPTION_MODES } from '../constants/optionModes.js'

export function imageOption(path, imageSrc) {
  const filename = path.split('/').pop()
  return {
    id: `image:${path}`, type: OPTION_MODES.IMAGE,
    label: filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '), imageSrc,
  }
}
