# Premium Black Interactive Calendar + React Performance Lab

## Aim
This project combines a premium dark calendar dashboard with an interactive React performance lab. The goal is to help learners see how rendering work changes when the app uses React.memo, useMemo, and useCallback in a realistic weekly scheduling interface.

## Objectives
- Build a premium black productivity calendar dashboard.
- Support event scheduling via drag and drop.
- Add category-based filtering.
- Provide a modal event inspection view.
- Demonstrate render optimization tradeoffs using React performance tools.
- Track render metrics without changing the clock behavior.

## Theory
The calendar demonstrates how UI updates can trigger rerenders in React. When an app gets more interactive, the app can spend unnecessary time rerendering large sections of the UI. React.memo, useMemo, and useCallback help avoid redundant work by reusing previous results and preventing unnecessary callback recreation.

## Implementation
The application is structured as a single dashboard where the main data and render state live in the root App component. The filtering and drag-and-drop logic update state immediately, while the render tracker measures the effect of optimization toggles. The custom hook `useRenderTracker.js` centralizes counters such as totals and callback recreation counts. A live clock runs separately every 450 milliseconds and updates only the displayed time, not the render monitor.

## React.memo explanation
React.memo skips rerendering a component when its props are unchanged. In this project, the EventCard component is wrapped in React.memo to demonstrate that only the source and destination cards rerender when one event is dragged. Without the optimization, all visible event cards rerender and the total render count rises faster.

## useMemo explanation
useMemo caches expensive derived values across renders. The event filtering logic is a good example because it computes a filtered list based on category. When the optimization is enabled, the filtered events list is cached, reducing repeated recomputation during rerenders.

## useCallback explanation
useCallback stabilizes callback functions so their identity does not change unless dependencies actually change. This reduces unnecessary rerenders in child components and avoids repeated recreation of event handlers that are passed down as props.

## Drag-and-drop explanation
The calendar uses native HTML5 drag and drop. Event cards are draggable, and each day column accepts drops. On drop, the event is moved to the destination day without reloading or using an external library. Dragging is designed to avoid opening the event modal while the action is in progress.

## Expected Outcome
The final app should feel like a modern productivity dashboard with a premium black theme, responsive layout, working drag-and-drop scheduling, functional category filters, and a render monitor that clearly shows the effect of optimization toggles.
