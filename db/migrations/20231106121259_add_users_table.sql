-- Create "users" table
CREATE TABLE "public"."users" (
  "id" character varying(36) NOT NULL DEFAULT random_prefix_id('usr'::text, 16),
  "created_at" integer NOT NULL DEFAULT round(EXTRACT(epoch FROM now())),
  "updated_at" integer NOT NULL DEFAULT round(EXTRACT(epoch FROM now())),
  "deleted_at" integer,
  "sub" character varying(255) NOT NULL,
  "phone_number" character varying(255) NOT NULL,
  "signup_city" character varying(255) NOT NULL,
  "signup_country" character varying(255) NOT NULL,
  "signup_latitude" decimal NOT NULL,
  "signup_longitude" decimal NOT NULL,
  PRIMARY KEY ("id")
);
-- Create index "users_phone_number_unique" to table: "users"
CREATE UNIQUE INDEX "users_phone_number_unique" ON "public"."users" ("phone_number") WHERE (deleted_at IS NULL);
-- Create index "users_sub_unique" to table: "users"
CREATE UNIQUE INDEX "users_sub_unique" ON "public"."users" ("sub") WHERE (deleted_at IS NULL);
