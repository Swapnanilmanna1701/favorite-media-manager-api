CREATE TABLE `entry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`director` text NOT NULL,
	`budget` real NOT NULL,
	`location` text NOT NULL,
	`duration` text NOT NULL,
	`year` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
