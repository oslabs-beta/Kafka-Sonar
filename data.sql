CREATE TABLE users (
  "user_id" serial NOT NULL UNIQUE,
  "username" varchar(255) NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "account_type" varchar(255) NOT NULL,
  CONSTRAINT "users_pk" PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE clusters (
	"cluster_id" serial NOT NULL UNIQUE,
	"client_id" varchar (255) NOT NULL UNIQUE,
	"bootstrap_hostname" varchar(255) NOT NULL,
	"port_number" varchar(255) NOT NULL,
	"auth_mechanism" varchar (255) NOT NULL,
	"username" varchar (255) NOT NULL,
	"password" varchar (255) NOT NULL,
	"user_network" varchar (255) NOT NULL,
	CONSTRAINT "cluster_pk" PRIMARY KEY ("cluster_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE jmx_ports (
	"port_id" serial NOT NULL UNIQUE,
	"cluster_id" integer NOT NULL,
	"jmx_hostname" varchar (255) NOT NULL,
	"jmx_port_number" varchar (255) NOT NULL,
	CONSTRAINT "jmx_ports_pk" PRIMARY KEY ("port_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE users_in_clusters (
	"_id" serial NOT NULL UNIQUE,
	"user_id" integer NOT NULL,
	"cluster_id" integer NOT NULL,
	CONSTRAINT "users_in_clusters_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE metrics_table (
	"_id" serial NOT NULL UNIQUE,
	"endpoint" varchar(255) NOT NULL,
	"metric_name" varchar(255) NOT NULL,
	"env" varchar(255) NOT NULL,
	"instance" varchar(255) NOT NULL,
	"job" varchar(255) NOT NULL,
	"service" varchar(255) NOT NULL,
	"request" varchar(255),
	"aggregate" varchar(255),
	"scope" varchar(255),
	"value" DOUBLE PRECISION NOT NULL,
	"timestamp" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	"cluster_id" integer NOT NULL,
	CONSTRAINT "metrics_table_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);

SELECT create_hypertable('metrics_table', 'timestamp');

ALTER TABLE "jmx_ports" ADD CONSTRAINT "jmx_ports_fk0" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("cluster_id") ON DELETE CASCADE;

ALTER TABLE "users_in_clusters" ADD CONSTRAINT "users_in_clusters_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE;
ALTER TABLE "users_in_clusters" ADD CONSTRAINT "users_in_clusters_fk1" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("cluster_id") ON DELETE CASCADE;

ALTER TABLE "metrics_table" ADD CONSTRAINT "metrics_table_fk0" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("cluster_id") ON DELETE CASCADE;