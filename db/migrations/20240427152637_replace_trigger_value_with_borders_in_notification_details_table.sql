ALTER TABLE "public"."notification_details"
ADD COLUMN "lower_border" decimal;

ALTER TABLE "public"."notification_details"
ADD COLUMN "upper_border" decimal;

ALTER TABLE "public"."notification_details"
ADD COLUMN "lower_border_active" boolean NOT NULL;

ALTER TABLE "public"."notification_details"
ADD COLUMN "upper_border_active" boolean NOT NULL;
