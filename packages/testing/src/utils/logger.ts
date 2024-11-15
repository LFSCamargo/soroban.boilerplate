export type LogTypes = "error" | "info" | "debug";

export const logger = {
  info: (message: string, extras?: Record<string, unknown>): void => {
    console.info(message, extras);
  },
  error: (message: string, possibleError: unknown): void => {
    console.error(message, possibleError);
  },
  debug: (message: string, data?: unknown, formatted?: boolean): void => {
    let extra = data;

    if (formatted) {
      extra = JSON.stringify(data, null, 2);
    }

    console.log(message, extra);
  },
};
