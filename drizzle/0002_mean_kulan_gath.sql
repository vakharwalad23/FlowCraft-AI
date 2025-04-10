ALTER TABLE "user" ADD COLUMN "on_boarded" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "tier" text DEFAULT 'free' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "flow_id_idx" ON "flow" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "flow_user_id_idx" ON "flow" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "flow_created_at_idx" ON "flow" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "flow_folder_id_idx" ON "flow_folder" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "flow_folder_user_id_idx" ON "flow_folder" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "flow_folder_created_at_idx" ON "flow_folder" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "flow_folder_relation_id_idx" ON "flow_folder_relation" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "flow_folder_relation_flow_id_folder_id_idx" ON "flow_folder_relation" USING btree ("flow_id","folder_id");--> statement-breakpoint
CREATE UNIQUE INDEX "flow_folder_relation_created_at_idx" ON "flow_folder_relation" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_idx" ON "user" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "user_name_idx" ON "user" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "user_created_at_idx" ON "user" USING btree ("created_at");