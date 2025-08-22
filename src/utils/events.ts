export const stringToList = (players?: string): string[] => {
  return players
    ?.split(/[\n,]/g)
    .map((s) => s.trim())
    .filter(Boolean) || []
}