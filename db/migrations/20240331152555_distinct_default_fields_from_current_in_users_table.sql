ALTER TABLE "public"."users"
RENAME COLUMN "signup_city" TO "default_city";

ALTER TABLE "public"."users"
RENAME COLUMN "signup_country" TO "default_country";

ALTER TABLE "public"."users"
RENAME COLUMN "signup_latitude" TO "default_latitude";

ALTER TABLE "public"."users"
RENAME COLUMN "signup_longitude" TO "default_longitude";

ALTER TABLE "public"."users"
ADD COLUMN "current_city" character varying(255);

ALTER TABLE "public"."users"
ADD COLUMN "current_country" character varying(255);

ALTER TABLE "public"."users"
ADD COLUMN "current_latitude" decimal;

ALTER TABLE "public"."users"
ADD COLUMN "current_longitude" decimal;
