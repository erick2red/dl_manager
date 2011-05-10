DROP TABLE IF EXISTS "handlers";
CREATE TABLE "handlers" ("handler_id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "handler" TEXT, "url_regex" TEXT);
INSERT INTO "handlers" VALUES(2,'youtube-dl','http://(www.)?youtube.*watch\?v=([a-zA-Z0-9-_]+)');
DROP TABLE IF EXISTS "urls";
CREATE TABLE "urls" ("url_id" INTEGER PRIMARY KEY  NOT NULL ,"user_id" INTEGER NOT NULL ,"status" INTEGER NOT NULL ,"url" TEXT,"address" TEXT,"size" INTEGER,"bw_limit" INTEGER NOT NULL  DEFAULT (0) );
DROP TABLE IF EXISTS "users";
CREATE TABLE "users" ("user_id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , "username" VARCHAR NOT NULL , "password" VARCHAR NOT NULL , "email" VARCHAR NOT NULL , "full_name" VARCHAR NOT NULL );
INSERT INTO "users" VALUES(1,'erick','83b93ce4501fe69da5a0129d97559d15','erick.red@gmail.com','Erick Pérez Castellanos');
