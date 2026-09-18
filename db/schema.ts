import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  summary: text("summary").notNull(),
  body: text("body").notNull(),
  media: text("media").notNull().default("[]"),
  published: integer("published").notNull().default(0),
  position: integer("position").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});

export const uploads = sqliteTable("uploads", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  createdAt: text("created_at").notNull(),
});
