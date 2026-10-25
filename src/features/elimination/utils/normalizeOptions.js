export function normalizeOptions(existingOptions, candidates) {
  const seen = new Set(existingOptions.map((option) => option.toLowerCase()))
  const options = [...existingOptions]

  for (const candidate of candidates) {
    const option = candidate.trim()
    const key = option.toLowerCase()

    if (option && !seen.has(key)) {
      seen.add(key)
      options.push(option)
    }
  }

  return options
}
