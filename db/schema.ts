import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull(),
    onBoarded: boolean("on_boarded").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),

    // Stripe
    stripeCustomerId: text("stripe_customer_id"),
    tier: text("tier", { enum: ["free", "pro", "enterprise"] })
      .notNull()
      .default("free"),
  },
  (user) => [
    uniqueIndex("user_id_idx").on(user.id),
    uniqueIndex("user_email_idx").on(user.email),
    uniqueIndex("user_name_idx").on(user.name),
    uniqueIndex("user_created_at_idx").on(user.createdAt),
  ]
);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const flow = pgTable(
  "flow",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    steps: jsonb("steps").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (flow) => [
    uniqueIndex("flow_id_idx").on(flow.id),
    uniqueIndex("flow_user_id_idx").on(flow.userId),
    uniqueIndex("flow_created_at_idx").on(flow.createdAt),
    index("flow_name_search_idx").using(
      "gin",
      sql`to_tsvector('english', coalesce(${flow.name}, ''))`
    ),
  ]
);

export const flowFolder = pgTable(
  "flow_folder",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (flowFolder) => [
    uniqueIndex("flow_folder_id_idx").on(flowFolder.id),
    uniqueIndex("flow_folder_user_id_idx").on(flowFolder.userId),
    uniqueIndex("flow_folder_created_at_idx").on(flowFolder.createdAt),
    index("flow_folder_name_search_idx").using(
      "gin",
      sql`to_tsvector('english', coalesce(${flowFolder.name}, ''))`
    ),
  ]
);

export const flowFolderRelation = pgTable(
  "flow_folder_relation",
  {
    id: text("id").primaryKey(),
    flowId: text("flow_id")
      .notNull()
      .references(() => flow.id, { onDelete: "cascade" }),
    folderId: text("folder_id")
      .notNull()
      .references(() => flowFolder.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (flowFolderRelation) => [
    uniqueIndex("flow_folder_relation_id_idx").on(flowFolderRelation.id),
    uniqueIndex("flow_folder_relation_flow_id_folder_id_idx").on(
      flowFolderRelation.flowId,
      flowFolderRelation.folderId
    ),
    uniqueIndex("flow_folder_relation_created_at_idx").on(
      flowFolderRelation.createdAt
    ),
  ]
);

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type Flow = typeof flow.$inferSelect;
export type FlowFolder = typeof flowFolder.$inferSelect;
export type FlowFolderRelation = typeof flowFolderRelation.$inferSelect;
