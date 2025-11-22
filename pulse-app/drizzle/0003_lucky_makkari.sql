ALTER TABLE `goals` ADD `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `goals` ADD `is_completed` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `goals` ADD `completed_at` text;--> statement-breakpoint
ALTER TABLE `goals` DROP COLUMN `goal_type`;--> statement-breakpoint
ALTER TABLE `goals` DROP COLUMN `value`;--> statement-breakpoint
ALTER TABLE `goals` DROP COLUMN `status`;