USE [PlaceMap]
GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_Insert]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[Sp_Account_Insert]
 	@ParentId int,
 	@Type int,
 	@DisplayName nvarchar(50),
 	@UserName varchar(50),
 	@Password varchar(50),
 	@Email varchar(50),
	@DeviceMobile varchar(50),
 	@Id int output
AS
BEGIN	
	SET NOCOUNT ON;    
	INSERT INTO Account(ParentId,Type,DisplayName,UserName,Password,Email,DeviceMobile) values(@ParentId,@Type,@DisplayName,@UserName,@Password,@Email,@DeviceMobile)
	set @Id=SCOPE_IDENTITY()
END
GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_ListAll]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CHINHNB
-- Create date: 12/07/2016
-- Description:	Get All Account
-- =============================================
Create PROCEDURE [dbo].[Sp_Account_ListAll] 	
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM Account
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_ListAllPaging]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: chinhnb
-- Create date: 10/08/2016
-- Description:	
-- =============================================
create procedure [dbo].[Sp_Account_ListAllPaging]

(
@pageIndex int,
@pageSize int,
@totalRow int output
)

as

set nocount on

DECLARE @UpperBand int, @LowerBand int

SELECT @totalRow = COUNT(*) FROM Account					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY Id DESC) AS RowNumber 
FROM Account

) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand
GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_Login]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CHINHNB
-- Create date: 12/07/2016
-- Description:	login
-- =============================================
Create PROCEDURE [dbo].[Sp_Account_Login]
 	@userName varchar(50),
 	@password varchar(50)
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM Account where (UserName=@userName or Email=@userName) and [Password]=@password
END
GO
/****** Object:  StoredProcedure [dbo].[Sp_Category_Insert]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Category_Insert]
 	@Name nvarchar(250),
 	@Url varchar(250),
 	@CreatedBy varchar(50),
 	@ParentId int,
 	@Type int,
 	@Position int,
 	@Id int output
AS
BEGIN	
	SET NOCOUNT ON;    
	INSERT INTO Category(ParentId,Type,Name,Url,Position,CreatedBy) values(@ParentId,@Type,@Name,@Url,@Position,@CreatedBy)
	set @Id=SCOPE_IDENTITY()
END
GO
/****** Object:  StoredProcedure [dbo].[Sp_Category_ListAllPaging]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: chinhnb
-- Create date: 10/08/2016
-- Description:	
-- =============================================
CREATE procedure [dbo].[Sp_Category_ListAllPaging]

(
@pageIndex int,
@pageSize int,
@totalRow int output
)

as

set nocount on

DECLARE @UpperBand int, @LowerBand int

SELECT @totalRow = COUNT(*) FROM Category					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY Id DESC) AS RowNumber 
FROM Category

) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand
GO
/****** Object:  StoredProcedure [dbo].[Sp_Product_Insert]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[Sp_Product_Insert]
	@CategoryId int,
	@ManufacturerId int,
 	@Name nvarchar(250),
 	@Url varchar(250),
 	@Avatar varchar(250),
 	@Price varchar(50),
 	@PriceKm varchar(50),
 	@Condition nvarchar(50),
 	@Weigh nvarchar(50),
 	@Origin nvarchar(50),
 	@Description ntext,
 	@Video ntext,
 	@IsHighlights bit,
 	@IsTop bit,
 	@CreatedBy varchar(50), 	
 	@Id int output
AS
BEGIN	
	SET NOCOUNT ON;    
	INSERT INTO Product(CategoryId,ManufacturerId,Name,Url,Avatar,Price,PriceKm,Condition,Weigh,Origin,Description,Video,IsHighlights,IsTop,CreatedBy) 
	values(@CategoryId,@ManufacturerId,@Name,@Url,@Avatar,@Price,@PriceKm,@Condition,@Weigh,@Origin,@Description,@Video,@IsHighlights,@IsTop,@CreatedBy)
	set @Id=SCOPE_IDENTITY()
END
GO
/****** Object:  StoredProcedure [dbo].[Sp_Product_ListAllPaging]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: chinhnb
-- Create date: 10/08/2016
-- Description:	
-- =============================================
Create procedure [dbo].[Sp_Product_ListAllPaging]

(
@pageIndex int,
@pageSize int,
@totalRow int output
)

as

set nocount on

DECLARE @UpperBand int, @LowerBand int

SELECT @totalRow = COUNT(*) FROM Product					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY Id DESC) AS RowNumber 
FROM Product

) AS temp

GO
/****** Object:  Table [dbo].[Account]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Account](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ParentId] [int] NULL,
	[Type] [int] NULL,
	[DisplayName] [nvarchar](50) NULL,
	[UserName] [varchar](50) NULL,
	[Password] [varchar](50) NULL,
	[Email] [varchar](50) NULL,
	[DeviceMobile] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL CONSTRAINT [DF_Account_CreatedDate]  DEFAULT (getdate()),
	[Status] [bit] NULL CONSTRAINT [DF_Account_Status]  DEFAULT ((0)),
 CONSTRAINT [PK_Account] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[AccountDetail]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccountDetail](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AccountId] [int] NULL,
	[FirstName] [nvarchar](50) NULL,
	[LastName] [nvarchar](50) NULL,
	[Address] [nchar](10) NULL,
 CONSTRAINT [PK_AccountDetail] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Category]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Category](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ParentId] [int] NULL,
	[Type] [int] NULL,
	[Name] [nvarchar](250) NULL,
	[Url] [varchar](250) NULL,
	[Position] [int] NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL CONSTRAINT [DF_Category_CreatedDate]  DEFAULT (getdate()),
	[Status] [bit] NULL CONSTRAINT [DF_Category_Status]  DEFAULT ((1)),
 CONSTRAINT [PK_Category] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[LocaltionChecked]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LocaltionChecked](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AccountId] [int] NULL,
	[LocaltionId] [int] NULL,
	[DateChecked] [datetime] NULL,
	[IsNumberWrong] [int] NULL,
 CONSTRAINT [PK_LocaltionChecked] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Location]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Location](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AccountId] [int] NULL,
	[Lag] [int] NULL,
	[Lng] [int] NULL,
	[Name] [nvarchar](250) NULL,
	[Image] [nvarchar](250) NULL,
	[Address] [nvarchar](250) NULL,
	[CreatedDate] [datetime] NULL,
	[Status] [int] NULL,
 CONSTRAINT [PK_Location] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Manufacturer]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Manufacturer](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
 CONSTRAINT [PK_Manufacturer] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[News]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[News](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CategoryId] [int] NULL,
	[Title] [nvarchar](250) NULL,
	[Url] [varchar](250) NULL,
	[Avatar] [varchar](250) NULL,
	[Sapo] [nvarchar](1000) NULL,
	[Content] [ntext] NULL,
	[Author] [nvarchar](50) NULL,
	[CountView] [int] NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[Status] [bit] NULL,
 CONSTRAINT [PK_News] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Product]    Script Date: 11/23/2016 3:55:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Product](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CategoryId] [int] NULL,
	[ManufacturerId] [int] NULL,
	[Name] [nvarchar](250) NULL,
	[Url] [varchar](250) NULL,
	[Avatar] [varchar](250) NULL,
	[Price] [varchar](50) NULL,
	[PriceKm] [varchar](50) NULL,
	[Condition] [nvarchar](50) NULL,
	[Weigh] [nvarchar](50) NULL,
	[Origin] [nvarchar](50) NULL,
	[Description] [ntext] NULL,
	[Video] [ntext] NULL,
	[CountView] [int] NULL,
	[IsHighlights] [bit] NULL,
	[IsTop] [bit] NULL,
	[CreatedBy] [varchar](50) NULL,
	[CreatedDate] [datetime] NULL,
	[Status] [bit] NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
