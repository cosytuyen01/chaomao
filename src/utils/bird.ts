import defaultBirdImage from '../assets/anhchaomao.png'

export const DEFAULT_BIRD_IMAGE = defaultBirdImage

export function formatSeasons(seasons: number): string {
  if (seasons === 0) return 'Bổi rừng'
  return `${seasons} mùa`
}
