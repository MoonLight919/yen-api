ALTER TABLE "public"."users"
ADD COLUMN "default_location_for_alerts_in_ua_notifications" boolean NOT NULL DEFAULT true;

ALTER TABLE "public"."users"
ADD COLUMN "default_location_for_air_quality_and_weather_notifications" boolean NOT NULL DEFAULT true;

ALTER TABLE "public"."users"
ADD COLUMN "default_location_for_radiation_level_notifications" boolean NOT NULL DEFAULT true;
