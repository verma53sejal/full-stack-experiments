import { useRef } from 'react'

export function useRenderTracker(name, onRender) {
  const renders = useRef(0)
  renders.current += 1
  onRender?.(name, renders.current)
  return renders.current
}
