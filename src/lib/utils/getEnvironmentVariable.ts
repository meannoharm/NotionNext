export function serverSideGetEnv(
  key: string,
  defaultValue?: string,
  env = process.env,
): string {
  if (typeof window !== 'undefined') {
    throw new Error(`Config error: cannot get environment variable "${key}" in browser`);
  }

  const value = env[key];

  if (value !== undefined) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Config error: missing required env variable "${key}"`);
}

// vercel build process.env.NEXT_PUBLIC_*** will be inline string value
export function clientSideGetEnv(
  key: string,
  value?: string,
  defaultValue?: string,
): string {
  if (value) {
    return value;
  }

  if (defaultValue) {
    return defaultValue;
  }

  throw new Error(`Config error: missing required env variable "${key}"`);
}
