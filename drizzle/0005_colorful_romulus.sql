DROP INDEX "user_name_idx";--> statement-breakpoint
CREATE INDEX "user_name_idx" ON "user" USING btree ("name");