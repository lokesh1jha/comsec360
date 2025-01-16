DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('admin', 'account_user', 'guest');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "type" NOT NULL,
	"email" varchar(320) NOT NULL
);
