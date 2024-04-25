CREATE TABLE "public"."notification_details" (
  "id" character varying(36) NOT NULL DEFAULT random_prefix_id('nd'::text, 16),
  "created_at" integer NOT NULL DEFAULT round(EXTRACT(epoch FROM now())),
  "updated_at" integer NOT NULL DEFAULT round(EXTRACT(epoch FROM now())),
  "deleted_at" integer,
  "user" character varying(36) NOT NULL,
  "type" character varying(36) NOT NULL,
  "trigger_value" decimal,
  "default_location" boolean NOT NULL,
  "active" boolean NOT NULL,
  "alert_in_progress" boolean NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "notification_details_user_foreign" FOREIGN KEY ("user") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);
