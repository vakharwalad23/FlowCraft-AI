DROP INDEX "flow_user_id_idx";--> statement-breakpoint
DROP INDEX "flow_created_at_idx";--> statement-breakpoint
DROP INDEX "flow_folder_user_id_idx";--> statement-breakpoint
DROP INDEX "flow_folder_created_at_idx";--> statement-breakpoint
DROP INDEX "user_created_at_idx";--> statement-breakpoint
CREATE INDEX "flow_user_id_idx" ON "flow" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "flow_created_at_idx" ON "flow" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "flow_folder_user_id_idx" ON "flow_folder" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "flow_folder_created_at_idx" ON "flow_folder" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_created_at_idx" ON "user" USING btree ("created_at");