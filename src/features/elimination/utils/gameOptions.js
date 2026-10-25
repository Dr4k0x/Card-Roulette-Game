import { normalizeOptions } from './normalizeOptions.js'
import { OPTION_MODES } from '../../../shared/constants/optionModes.js'

export { OPTION_MODES } from '../../../shared/constants/optionModes.js'

export function optionLabel(option) {
  return typeof option === 'string' ? option : option.label
}

export function addTextCandidates(existing, candidates) {
  return normalizeOptions(existing.map(optionLabel), candidates).map((label) => ({
    id: `text:${label.toLowerCase()}`, type: OPTION_MODES.TEXT, label,
  }))
}

export { imageOption } from '../../../shared/utils/imageOption.js'
