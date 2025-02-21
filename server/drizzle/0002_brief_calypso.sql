CREATE TABLE `image` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text,
	`image_url` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
