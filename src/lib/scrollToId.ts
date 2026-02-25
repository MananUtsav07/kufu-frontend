export function scrollToId(id: string): void {
  if (!id) {
    return
  }

  const maxAttempts = 20
  let attempts = 0

  const tryScroll = () => {
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    attempts += 1
    if (attempts < maxAttempts) {
      window.requestAnimationFrame(tryScroll)
    }
  }

  window.requestAnimationFrame(tryScroll)
}
