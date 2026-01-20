CREATE TABLE "word" (
	"id" varchar PRIMARY KEY DEFAULT 'gen_random_uuid()' NOT NULL,
	"es" varchar NOT NULL,
	"en" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
