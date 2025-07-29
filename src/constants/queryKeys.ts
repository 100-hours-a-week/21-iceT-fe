export const queryKeys = {
  users: {
    all: ['users'] as const,
    stats: ['users', 'stats'] as const,
    profile: ['users', 'profile'] as const,
    presignedUrl: ['users', 'profile', 'presigned-url'] as const,
  },

  problems: {
    all: ['problems'] as const,
    set: (date: string) => [...queryKeys.problems.all, 'set', date] as const,
    solution: (problemNumber: number) =>
      [...queryKeys.problems.all, 'solution', problemNumber] as const,
    aiRecommended: (date: string) => [...queryKeys.problems.all, 'ai', date] as const,
  },

  auth: {
    all: ['auth'] as const,
    status: ['auth', 'status'] as const,
  },

  post: {
    all: ['posts'] as const,
    detail: (postId: number) => [...queryKeys.post.all, 'post', postId] as const,
    like: (postId: number) => ['post', postId, 'like'],
    comment: (postId: number) => ['post', postId, 'comment'],
    my: ['posts', 'my'],
    hot: ['posts', 'hot'],
  },
  alarm: {
    all: ['alarms'] as const,
  },
  chatbot: {
    all: ['chatbots'] as const,
  },
};
