declare module 'biliBili' {
  interface VideoListResponse {
    id: number,
    title: string,
    play: number,
    comment: string,
    created: number,
  }

  interface CommentListResponse {
    pagination: PaginationType,
    comments: CommentType[]
  }

  interface PaginationType {
    page: number,
    limit: number,
    pages: number,
    total: number
  }

  interface CommentType {
    member: {
      uid: string,
      name: string,
      sex: string,
      level: number
    },
    content: string,
    created: number,
    like: number,
    reply: number
  }
}
