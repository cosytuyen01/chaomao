import { useRef, useState } from 'react'
import type { DaySchedule } from '../types'
import TodayScheduleCard from './TodayScheduleCard'

export interface TodayScheduleSlide {
  birdId: string
  birdName: string
  today?: DaySchedule
}

interface TodayScheduleSliderProps {
  slides: TodayScheduleSlide[]
}

export default function TodayScheduleSlider({ slides }: TodayScheduleSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el || el.offsetWidth === 0) return
    const index = Math.round(el.scrollLeft / el.offsetWidth)
    setActiveIndex(Math.min(index, slides.length - 1))
  }

  const scrollTo = (index: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: index * el.offsetWidth, behavior: 'smooth' })
    setActiveIndex(index)
  }

  if (slides.length === 0) {
    return <TodayScheduleCard />
  }

  if (slides.length === 1) {
    const slide = slides[0]
    return (
      <TodayScheduleCard today={slide.today} birdName={slide.birdName} />
    )
  }

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide) => (
          <div
            key={slide.birdId}
            className="w-full shrink-0 snap-center"
          >
            <TodayScheduleCard today={slide.today} birdName={slide.birdName} />
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {slides.map((slide, index) => (
          <button
            key={slide.birdId}
            type="button"
            aria-label={`chế độ ${slide.birdName}`}
            onClick={() => scrollTo(index)}
            className={[
              'h-2 rounded-full transition-all',
              index === activeIndex
                ? 'w-5 bg-primary'
                : 'w-2 bg-primary/25 hover:bg-primary/40',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}
