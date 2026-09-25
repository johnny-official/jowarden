export const LIMITS = {
  auth: {
    // Access token lifetime in seconds.
    accessTokenTtlSeconds: 3600,
    // Refresh sessions use a reusable opaque token with a sliding idle lifetime.
    refreshTokenWebSlidingTtlMs: 30 * 24 * 60 * 60 * 1000,
    refreshTokenDefaultSlidingTtlMs: 30 * 24 * 60 * 60 * 1000,
    refreshTokenMobileSlidingTtlMs: 90 * 24 * 60 * 60 * 1000,
    // Hard upper bound for one login session, regardless of sliding refreshes.
    refreshTokenAbsoluteTtlMs: 365 * 24 * 60 * 60 * 1000,
    // Refresh token random byte length.
    refreshTokenRandomBytes: 32,
    // Attachment download token lifetime in seconds.
    fileDownloadTokenTtlSeconds: 300,
    // Send access token lifetime in seconds.
    sendAccessTokenTtlSeconds: 300,
    // Minimum required JWT secret length.
    jwtSecretMinLength: 32,
    // Default PBKDF2 iterations for account creation/prelogin fallback.
    defaultKdfIterations: 600000,
    // clientSecret length
    // clientSecret 长度
    clientSecretLength: 30,
  },
  rateLimit: {
    // Max failed login attempts before temporary lock.
    loginMaxAttempts: 5,
    // Login lock duration in minutes.
    loginLockoutMinutes: 5,
    // Authenticated API request budget per user per minute (all reads & writes combined).
    apiRequestsPerMinute: 200,
    // Public (unauthenticated) request budget per IP per minute.
    publicRequestsPerMinute: 60,
    // Public read-only request budget per IP per minute.
    publicReadRequestsPerMinute: 120,
    // Public website icon proxy budget per IP per minute.
    publicIconRequestsPerMinute: 500,
    // Sensitive public/auth request budget per IP per minute.
    sensitivePublicRequestsPerMinute: 30,
    // Password hint lookup budget per IP per minute.
    passwordHintRequestsPerMinute: 1,
    // Password hint lookup budget per IP per hour.
    passwordHintRequestsPerHour: 3,
    // Register endpoint budget per IP per minute.
    registerRequestsPerMinute: 5,
    // Refresh-token grant budget per IP per minute.
    refreshTokenRequestsPerMinute: 30,
    // Coarser IP budget; the per-session budget above remains the primary guard.
    refreshTokenRequestsPerIpMinute: 300,
    // Passwordless/auth-request creation budget per IP/email/device per minute.
    authRequestRequestsPerMinute: 5,
    // Fixed window size for API rate limiting in seconds.
    apiWindowSeconds: 60,
    // Probability to run low-frequency cleanup on request path.
    cleanupProbability: 0.05,
    // Minimum interval between login-attempt cleanup runs.
    loginIpCleanupIntervalMs: 10 * 60 * 1000,
    // Retention window for login IP records.
    loginIpRetentionMs: 30 * 24 * 60 * 60 * 1000,
  },
  cleanup: {
    // Minimum interval between refresh-token cleanup runs.
    refreshTokenCleanupIntervalMs: 30 * 60 * 1000,
    // Minimum interval between used attachment token cleanup runs.
    attachmentTokenCleanupIntervalMs: 10 * 60 * 1000,
    // Probability to trigger cleanup during requests.
    cleanupProbability: 0.05,
  },
  attachment: {
    // Max attachment upload size in bytes.
    maxFileSizeBytes: 90 * 1024 * 1024,
  },
  send: {
    // Max file size allowed for Send file uploads.
    maxFileSizeBytes: 90 * 1024 * 1024,
    // Max days allowed between now and deletion date.
    maxDeletionDays: 31,
  },
  pagination: {
    // Default page size when client does not specify pageSize.
    defaultPageSize: 100,
    // Hard maximum page size accepted by server.
    maxPageSize: 500,
  },
  cors: {
    // Browser preflight cache max age in seconds.
    preflightMaxAgeSeconds: 86400,
  },
  cache: {
    // Icon proxy cache TTL in seconds.
    iconTtlSeconds: 604800,
    // In-memory /api/sync response cache TTL (milliseconds).
    syncResponseTtlMs: 30 * 1000,
  },
  performance: {
    // Max IDs per SQL batch when moving ciphers in bulk.
    bulkMoveChunkSize: 200,
    // Max total items (folders + ciphers) allowed in a single import.
    importItemLimit: 5000,
    // Small fixed concurrency for blob/attachment batch cleanup work.
    attachmentDeleteConcurrency: 4,
  },
  request: {
    maxBodyBytes: 25 * 1024 * 1024,
  },
  compatibility: {
    bitwardenServerVersion: '2026.6.0',
    cipherKeyEncryptionFeatureEnabled: true,
  },
} as const;

export function getRefreshTokenSlidingTtlMs(clientType?: string | null): number {
  const normalized = String(clientType || '').trim().toLowerCase();
  if (normalized === 'web') return LIMITS.auth.refreshTokenWebSlidingTtlMs;
  if (normalized === 'mobile') return LIMITS.auth.refreshTokenMobileSlidingTtlMs;
  return LIMITS.auth.refreshTokenDefaultSlidingTtlMs;
}
