CREATE TABLE [dbo].[Book](
	[BookID] [int] IDENTITY(1,1) NOT NULL,
	[ReadStatus] [nvarchar](255) NULL,
	[ReadRemark] [nvarchar](255) NULL,
	[Title] [nvarchar](1000) NULL,
	[Author] [nvarchar](1000) NULL,
	[Identifier] [nvarchar](1000) NULL,
	[Language] [nvarchar](255) NULL,
	[Category] [nvarchar](255) NULL,
	[Subject] [nvarchar](max) NULL,
	[Description] [nvarchar](max) NULL,
	[Folder] [nvarchar](1000) NULL,
	[FileName] [nvarchar](1000) NULL,
	[Status] [nvarchar](500) NULL,
	[StatusRemark] [nvarchar](500) NULL,
	[Medium] [nvarchar](500) NULL,
	[NrOfPages] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[BookID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO