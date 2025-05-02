export function Spinner({
  size = 8,
  color = 'blue-500',
}: {
  size?: number; // size in Tailwind units (e.g. 8 → w-8 h-8)
  color?: string; // tailwind color (e.g. "blue-500", "white")
}) {
  const dimension = `w-${size} h-${size}`;
  const borderColor = `border-${color}`;
  return (
    <div className="flex items-center justify-center">
      <div
        className={`
              ${dimension}
              border-4
              border-gray-200
              ${borderColor}
              rounded-full
              animate-spin
            `}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
