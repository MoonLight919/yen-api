-- Create "users" table
CREATE TABLE "public"."users" (
  "id" character varying(36) NOT NULL DEFAULT random_prefix_id('usr'::text, 16),
  "created_at" integer NOT NULL DEFAULT round(EXTRACT(epoch FROM now())),
  "updated_at" integer NOT NULL DEFAULT round(EXTRACT(epoch FROM now())),
  "deleted_at" integer,
  "sub" character varying(255),
  "phone_number" character varying(255),
  PRIMARY KEY ("id")
);
-- Create index "users_phone_number_unique" to table: "users"
CREATE UNIQUE INDEX "users_phone_number_unique" ON "public"."users" ("phone_number") WHERE (deleted_at IS NULL);
