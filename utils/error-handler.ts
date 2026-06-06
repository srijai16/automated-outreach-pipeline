export function handleError(
  stage: string,
  error: unknown
) {
  console.error(`[${stage}]`, error);

  return {
    stage,
    success: false,
    message: "Stage failed"
  };
}