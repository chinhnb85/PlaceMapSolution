USE [PlaceMap]
GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_Delete]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Account_Delete] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	delete Account where Id=@Id
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_Insert]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Account_Insert]
 	@ParentId int,
 	@Type int,
 	@DisplayName nvarchar(50),
 	@UserName varchar(50),
 	@Password varchar(50),
 	@Email varchar(50),
 	@Phone varchar(50),
 	@Address nvarchar(250), 
 	@BirthDay datetime, 	
	@DeviceMobile varchar(50),
	@Status bit,
 	@Id int output
AS
BEGIN	
	SET NOCOUNT ON;    
	INSERT INTO Account(ParentId,Type,DisplayName,UserName,Password,Email,Phone,Address,BirthDay,DeviceMobile,Status) 
	values(@ParentId,@Type,@DisplayName,@UserName,@Password,@Email,@Phone,@Address,@BirthDay,@DeviceMobile,@Status)
	set @Id=SCOPE_IDENTITY()
END
GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_ListAll]    Script Date: 11/25/2016 12:46:03 AM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Account_ListAllPaging]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: chinhnb
-- Create date: 10/08/2016
-- Description:	
-- =============================================
CREATE procedure [dbo].[Sp_Account_ListAllPaging]

(
@KeySearch nvarchar(250),
@pageIndex int,
@pageSize int,
@sortColumn varchar(50),
@sortDesc varchar(50),
@totalRow int output
)

as

set nocount on

IF(@KeySearch <> '')BEGIN
		SET @KeySearch = '%' + @KeySearch + '%'
	END

DECLARE @UpperBand int, @LowerBand int

SELECT @totalRow = COUNT(*) FROM Account where @KeySearch='' or (@KeySearch<>'' and DisplayName like @KeySearch) 
					or (@KeySearch<>'' and Email like @KeySearch) 
					or (@KeySearch<>'' and Phone like @KeySearch)					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY Id DESC) AS RowNumber 
FROM Account
where @KeySearch='' or (@KeySearch<>'' and DisplayName like @KeySearch) 
					or (@KeySearch<>'' and Email like @KeySearch) 
					or (@KeySearch<>'' and Phone like @KeySearch)
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand
GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_Login]    Script Date: 11/25/2016 12:46:03 AM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Account_Update]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Account_Update]
 	@ParentId int,
 	@Type int,
 	@DisplayName nvarchar(50),
 	@UserName varchar(50),
 	@Password varchar(50),
 	@Email varchar(50),
 	@Phone varchar(50),
 	@Address nvarchar(250), 
 	@BirthDay datetime, 	
	@DeviceMobile varchar(50),
	@Status bit,
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	Update Account set DisplayName=@DisplayName,UserName=@UserName,
						Password=@Password,Email=@Email,Status=@Status,
						Phone=@Phone,Address=@Address,BirthDay=@BirthDay,
						DeviceMobile=@DeviceMobile
	where Id=@Id		
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_UpdateStatus]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Account_UpdateStatus] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON; 	
	Update Account set [Status] = case when [Status]='true' then 'false' else 'true' end  
	where Id=@Id
END
GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_ViewDetail]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Account_ViewDetail] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	select * from Account where Id=@Id
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Category_Insert]    Script Date: 11/25/2016 12:46:03 AM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Category_ListAllPaging]    Script Date: 11/25/2016 12:46:03 AM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_Delete]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Localtion_Delete] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	delete Localtion where Id=@Id
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_Insert]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Localtion_Insert]
 	@ParentId int,
 	@Type int,
 	@DisplayName nvarchar(50),
 	@UserName varchar(50),
 	@Password varchar(50),
 	@Email varchar(50),
 	@Phone varchar(50),
 	@Address nvarchar(250), 
 	@BirthDay datetime, 	
	@DeviceMobile varchar(50),
	@Status bit,
 	@Id int output
AS
BEGIN	
	SET NOCOUNT ON;    
	INSERT INTO Localtion(ParentId,Type,DisplayName,UserName,Password,Email,Phone,Address,BirthDay,DeviceMobile,Status) 
	values(@ParentId,@Type,@DisplayName,@UserName,@Password,@Email,@Phone,@Address,@BirthDay,@DeviceMobile,@Status)
	set @Id=SCOPE_IDENTITY()
END
GO
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_ListAll]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CHINHNB
-- Create date: 12/07/2016
-- Description:	Get All Localtion
-- =============================================
CREATE PROCEDURE [dbo].[Sp_Localtion_ListAll] 	
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM Localtion
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_ListAllPaging]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: chinhnb
-- Create date: 10/08/2016
-- Description:	
-- =============================================
CREATE procedure [dbo].[Sp_Localtion_ListAllPaging]

(
@KeySearch nvarchar(250),
@pageIndex int,
@pageSize int,
@sortColumn varchar(50),
@sortDesc varchar(50),
@totalRow int output
)

as

set nocount on

IF(@KeySearch <> '')BEGIN
		SET @KeySearch = '%' + @KeySearch + '%'
	END

DECLARE @UpperBand int, @LowerBand int

SELECT @totalRow = COUNT(*) FROM Localtion where @KeySearch='' or (@KeySearch<>'' and DisplayName like @KeySearch) 
					or (@KeySearch<>'' and Email like @KeySearch) 
					or (@KeySearch<>'' and Phone like @KeySearch)					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY Id DESC) AS RowNumber 
FROM Localtion
where @KeySearch='' or (@KeySearch<>'' and DisplayName like @KeySearch) 
					or (@KeySearch<>'' and Email like @KeySearch) 
					or (@KeySearch<>'' and Phone like @KeySearch)
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand
GO
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_Update]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Localtion_Update]
 	@ParentId int,
 	@Type int,
 	@DisplayName nvarchar(50),
 	@UserName varchar(50),
 	@Password varchar(50),
 	@Email varchar(50),
 	@Phone varchar(50),
 	@Address nvarchar(250), 
 	@BirthDay datetime, 	
	@DeviceMobile varchar(50),
	@Status bit,
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	Update Localtion set DisplayName=@DisplayName,UserName=@UserName,
						Password=@Password,Email=@Email,Status=@Status,
						Phone=@Phone,Address=@Address,BirthDay=@BirthDay,
						DeviceMobile=@DeviceMobile
	where Id=@Id		
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_UpdateStatus]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Localtion_UpdateStatus] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON; 	
	Update Localtion set [Status] = case when [Status]='true' then 'false' else 'true' end  
	where Id=@Id
END
GO
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_ViewDetail]    Script Date: 11/25/2016 12:46:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Localtion_ViewDetail] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	select * from Localtion where Id=@Id
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Product_Insert]    Script Date: 11/25/2016 12:46:03 AM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Product_ListAllPaging]    Script Date: 11/25/2016 12:46:03 AM ******/
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
/****** Object:  Table [dbo].[Account]    Script Date: 11/25/2016 12:46:03 AM ******/
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
	[Avatar] [varchar](250) NULL,
	[Email] [varchar](50) NULL,
	[Address] [nvarchar](250) NULL,
	[Phone] [varchar](50) NULL,
	[DeviceMobile] [varchar](50) NULL,
	[BirthDay] [datetime] NULL,
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
/****** Object:  Table [dbo].[Category]    Script Date: 11/25/2016 12:46:03 AM ******/
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
/****** Object:  Table [dbo].[LocaltionChecked]    Script Date: 11/25/2016 12:46:03 AM ******/
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
/****** Object:  Table [dbo].[Location]    Script Date: 11/25/2016 12:46:03 AM ******/
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
/****** Object:  Table [dbo].[Manufacturer]    Script Date: 11/25/2016 12:46:03 AM ******/
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
/****** Object:  Table [dbo].[News]    Script Date: 11/25/2016 12:46:03 AM ******/
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
/****** Object:  Table [dbo].[Product]    Script Date: 11/25/2016 12:46:03 AM ******/
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
