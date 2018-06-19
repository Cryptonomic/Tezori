import { modularScale } from 'polished'

export function ms(step) {
  return modularScale(step, '1rem', 'minorThird').replace('em', 'rem')
}
