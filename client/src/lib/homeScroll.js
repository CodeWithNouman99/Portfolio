// Remembers where the home page was scrolled, so coming back from a project page returns to the
// same spot. Kept in memory only: a refresh or a new visit forgets it and starts at the top.
let saved = null

export function saveHomeScroll(y) {
  saved = y
}

export function peekHomeScroll() {
  return saved
}
