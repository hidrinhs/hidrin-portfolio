export type Media = { url: string; kind: "image" | "video"; alt: string };
export type Project = { id: string; title: string; category: string; summary: string; body: string; media: Media[]; published: boolean; position: number; updatedAt: string };
