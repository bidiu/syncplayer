const makeColorAccessible = require('make-color-accessible')
const Color = require('color2')
const chain = require('lodash').chain

function profileColor (color, opts) {
  color = Color(color)

  return {
    hex: color.hexString(),
    saturation: color.saturation(),
    lightness: color.lightness(),
    contrast: color.contrast(Color(opts.background)),
    background: opts.background
  }
}

function pickColor(hexes, opts) {
  const defaults = {
    background: 'white',
    minContrast: 4.5 // https://www.w3.org/TR/WCAG20-TECHS/G18.html
  }
  opts = Object.assign(defaults, opts)
  opts.background = Color(opts.background)

  let best = null
  const colors = chain(hexes)
    .map(hex => profileColor(hex, opts))
    .orderBy('saturation', 'desc')

  // shoot for the stars
  best = colors
    .filter(color => color.contrast > opts.minContrast)
    .filter(color => opts.background.isLight() ? color.lightness > 0.3 : color.lightness < 0.6)
    .map('hex')
    .first()
    .value()

  // shoot for the moon
  if (!best) {
    best = colors
      .filter(color => color.contrast > opts.minContrast)
      .map('hex')
      .first()
      .value()
  }

  // go for broke
  if (!best) {
    let hex = colors
      .map('hex')
      .first()
      .value()
    best = makeColorAccessible(hex, opts)
  }

  return best
}

function getTransitionColor(start, end, percentage) {
  let r1 = parseInt(start.slice(1, 3), 16);
  let g1 = parseInt(start.slice(3, 5), 16);
  let b1 = parseInt(start.slice(5, 7), 16);

  let r2 = parseInt(end.slice(1, 3), 16);
  let g2 = parseInt(end.slice(3, 5), 16);
  let b2 = parseInt(end.slice(5, 7), 16);

  let r = Math.round(r1 + (r2 - r1) * percentage).toString(16);
  let g = Math.round(g1 + (g2 - g1) * percentage).toString(16);
  let b = Math.round(b1 + (b2 - b1) * percentage).toString(16);

  return '#' + r + g + b;
}

export { pickColor, getTransitionColor };
