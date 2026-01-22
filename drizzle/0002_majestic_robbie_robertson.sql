ALTER TABLE "word" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "word" ALTER COLUMN "id" SET DEFAULT 'gen_random_uuid()';--> statement-breakpoint
ALTER TABLE "word" ALTER COLUMN "es" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "word" ALTER COLUMN "en" SET DATA TYPE text;