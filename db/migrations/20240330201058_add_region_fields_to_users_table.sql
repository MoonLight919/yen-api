ALTER TABLE "public"."users"
ADD COLUMN "current_region" character varying(255);

ALTER TABLE "public"."users"
ADD COLUMN "default_region" character varying(255);
