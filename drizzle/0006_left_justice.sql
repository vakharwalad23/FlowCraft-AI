DROP INDEX "flow_folder_relation_created_at_idx";--> statement-breakpoint
CREATE INDEX "flow_folder_relation_created_at_idx" ON "flow_folder_relation" USING btree ("created_at");