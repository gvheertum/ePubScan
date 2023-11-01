-- Table: public.Book

-- DROP TABLE IF EXISTS public."Book";

CREATE TABLE IF NOT EXISTS public."Book"
(
    "BookID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "ReadStatus" character varying(255) COLLATE pg_catalog."default",
    "ReadRemark" character varying(255) COLLATE pg_catalog."default",
    "Title" character varying(1000) COLLATE pg_catalog."default",
    "Author" character varying(1000) COLLATE pg_catalog."default",
    "Identifier" character varying(1000) COLLATE pg_catalog."default",
    "Language" character varying(255) COLLATE pg_catalog."default",
    "Category" character varying(255) COLLATE pg_catalog."default",
    "Subject" text COLLATE pg_catalog."default",
    "Description" text COLLATE pg_catalog."default",
    "Folder" character varying(1000) COLLATE pg_catalog."default",
    "FileName" character varying(1000) COLLATE pg_catalog."default",
    "Status" character varying(500) COLLATE pg_catalog."default",
    "StatusRemark" character varying(500) COLLATE pg_catalog."default",
    "Medium" character varying(500) COLLATE pg_catalog."default",
    "NrOfPages" integer,
    CONSTRAINT "Book_pkey" PRIMARY KEY ("BookID")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Book"
    OWNER to "default";

REVOKE ALL ON TABLE public."Book" FROM catalogconsumer;

GRANT UPDATE, INSERT, SELECT ON TABLE public."Book" TO catalogconsumer;

GRANT ALL ON TABLE public."Book" TO "default";