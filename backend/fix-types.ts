// Utility to fix ZodError type compatibility issues
import { fromZodError } from "zod-validation-error";

export function safeFromZodError(error: any) {
  return fromZodError(error as any);
}
