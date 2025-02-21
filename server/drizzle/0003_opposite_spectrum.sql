ALTER TABLE `image` RENAME TO `uploaded_image`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_uploaded_image` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text,
	`image_url` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_uploaded_image`("id", "user_id", "image_url") SELECT "id", "user_id", "image_url" FROM `uploaded_image`;--> statement-breakpoint
DROP TABLE `uploaded_image`;--> statement-breakpoint
ALTER TABLE `__new_uploaded_image` RENAME TO `uploaded_image`;--> statement-breakpoint
PRAGMA foreign_keys=ON;