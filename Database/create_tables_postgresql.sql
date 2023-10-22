CREATE TABLE "Book" (
	"BookID" int PRIMARY KEY NOT NULL,
	"ReadStatus" varchar(255) NULL,
	"ReadRemark" varchar(255) NULL,
	"Title" varchar(1000) NULL,
	"Author" varchar(1000) NULL,
	"Identifier" varchar(1000) NULL,
	"Language" varchar(255) NULL,
	"Category" varchar(255) NULL,
	"Subject" TEXT NULL,
	"Description" TEXT NULL,
	"Folder" varchar(1000) NULL,
	"FileName" varchar(1000) NULL,
	"Status" varchar(500) NULL,
	"StatusRemark" varchar(500) NULL,
	"Medium" varchar(500) NULL,
	"NrOfPages" int NULL
) 

CREATE TABLE "VideoGame" (
	"VideoGameID" int PRIMARY KEY NOT NULL,
	"Name" varchar(255) NOT NULL,
	"Platform" varchar(100) NOT NULL,
	"Remark" varchar(500) NULL,
	"Status" varchar(255) NULL
) 