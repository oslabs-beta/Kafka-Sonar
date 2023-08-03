CREATE TABLE users (
	"user_id" serial NOT NULL UNIQUE,
	"email" varchar(255) NOT NULL,
	"password" TEXT NOT NULL,
	"account_type" varchar(255) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE clusters (
	"cluster_id" serial NOT NULL UNIQUE,
	"client_id" varchar (255) NOT NULL,
	"bootstrap_hostname" varchar(255) NOT NULL,
	"port_number" varchar(255) NOT NULL,
	"auth_mechanism" varchar (255) NOT NULL,
	"username" varchar (255) NOT NULL,
	"password" varchar (255) NOT NULL,
	"app_cluster_id" varchar (255) NOT NULL,
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

CREATE TABLE error_logs (
	"_id" serial NOT NULL,
	"cluster_id" integer NOT NULL,
	"message" TEXT NOT NULL,
	CONSTRAINT "error_logs_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "jmx_ports" ADD CONSTRAINT "jmx_ports_fk0" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("cluster_id") ON DELETE CASCADE;

ALTER TABLE "users_in_clusters" ADD CONSTRAINT "users_in_clusters_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE;
ALTER TABLE "users_in_clusters" ADD CONSTRAINT "users_in_clusters_fk1" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("cluster_id") ON DELETE CASCADE;

ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_fk0" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("cluster_id") ON DELETE CASCADE;