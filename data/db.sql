CREATE TABLE "handlers" ("handler_id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "handler" TEXT, "url_regex" TEXT);
CREATE TABLE "urls" ("url_id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , "user_id" INTEGER NOT NULL , "status" TEXT NOT NULL  check(typeof("status") = 'text') , "url" TEXT, "address" TEXT, "size" INTEGER);
CREATE TABLE "users" ("user_id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , "username" VARCHAR NOT NULL , "password" VARCHAR NOT NULL , "email" VARCHAR NOT NULL , "full_name" VARCHAR NOT NULL );
