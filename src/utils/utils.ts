
export type MatchingResult = "full" | "partial" | "none";

export function getMatchingResult<MatchingType>(
  values: MatchingType[],
  targetValues: MatchingType[],
): MatchingResult {
  const hasMatching = values.some((value) => targetValues.includes(value));

  return values.length === targetValues.length &&
    values.every((value) => targetValues.includes(value))
    ? "full"
    : hasMatching
      ? "partial"
      : "none"
}