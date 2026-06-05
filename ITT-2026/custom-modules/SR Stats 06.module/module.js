function animateValue (obj, start, end, duration, format) {
  let startTimestamp = null
  const step = timestamp => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    if (format == 'true') {
      obj.innerHTML = Math.floor(
        progress * (end - start) + start
      ).toLocaleString('en')
    } else obj.innerHTML = Math.floor(progress * (end - start) + start)
    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }
  window.requestAnimationFrame(step)
}

document.querySelectorAll('.sr-stats-06').forEach(el => {
  if (el.dataset.animate == 'true') {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.stat-counter').forEach(el2 => {
            animateValue(
              el2,
              1,
              el2.dataset.stat,
              el.dataset.speed * 1000,
              el2.dataset.format
            )
          })
        }
      },
      {
        root: null,
        threshold: 0
      }
    )
    observer.observe(el)
  }
})
