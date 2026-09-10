import { useCallback, useState } from 'react';

const createEmptyStats = () => ({
  totalRenders: 0,
  cardsRendered: 0,
  memoCacheHits: 0,
  callbackRecreations: 0,
  eventRenderCounts: {},
});

export function useRenderTracker() {
  const [stats, setStats] = useState(createEmptyStats);

  const resetStats = useCallback(() => {
    setStats(createEmptyStats());
  }, []);

  const applyRenderDelta = useCallback((type, reactMemoEnabled = false, eventIds = []) => {
    if (type !== 'drag' && type !== 'filter') {
      return;
    }

    const delta = reactMemoEnabled ? 2 : 9;

    setStats((previous) => {
      const nextEventRenderCounts = { ...previous.eventRenderCounts };

      if (type === 'drag') {
        eventIds.forEach((eventId) => {
          nextEventRenderCounts[eventId] = (nextEventRenderCounts[eventId] ?? 0) + 1;
        });

        if (reactMemoEnabled) {
          return {
            ...previous,
            totalRenders: previous.totalRenders + delta,
            cardsRendered: Math.min(previous.cardsRendered + 1, 8),
            eventRenderCounts: nextEventRenderCounts,
          };
        }

        return {
          ...previous,
          totalRenders: previous.totalRenders + delta,
          cardsRendered: 8,
          eventRenderCounts: nextEventRenderCounts,
        };
      }

      return {
        ...previous,
        totalRenders: previous.totalRenders + delta,
        cardsRendered: previous.cardsRendered,
        eventRenderCounts: nextEventRenderCounts,
      };
    });
  }, []);

  const addMemoCacheHit = useCallback(() => {
    setStats((previous) => ({
      ...previous,
      memoCacheHits: previous.memoCacheHits + 1,
    }));
  }, []);

  const addCallbackRecreation = useCallback(() => {
    setStats((previous) => ({
      ...previous,
      callbackRecreations: previous.callbackRecreations + 1,
    }));
  }, []);

  const registerCardRender = useCallback((eventId) => {
    setStats((previous) => {
      const current = previous.eventRenderCounts[eventId] ?? 0;
      return {
        ...previous,
        eventRenderCounts: {
          ...previous.eventRenderCounts,
          [eventId]: current + 1,
        },
      };
    });
  }, []);

  return {
    stats,
    applyRenderDelta,
    addMemoCacheHit,
    addCallbackRecreation,
    resetStats,
    registerCardRender,
  };
}
