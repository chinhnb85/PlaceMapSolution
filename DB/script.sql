USE [PlaceMap]
GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_Delete]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Account_GetAccountByUserName]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Account_GetAccountByUserName] 	
 	@UserName varchar(50)
AS
BEGIN	
	SET NOCOUNT ON;    
	select * from Account where UserName=@UserName
END


GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_Insert]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Account_ListAll]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Account_ListAllByType]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		CHINHNB
-- Create date: 12/07/2016
-- Description:	Get All Account
-- =============================================
CREATE PROCEDURE [dbo].[Sp_Account_ListAllByType] 	
(
@type int
)
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM Account where Type=@type
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_ListAllPaging]    Script Date: 12/22/2016 10:30:50 PM ******/
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
@type int,
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

SELECT @totalRow = COUNT(*) FROM Account where (@KeySearch='' or (@KeySearch<>'' and DisplayName like @KeySearch) 
					or (@KeySearch<>'' and Email like @KeySearch) 
					or (@KeySearch<>'' and Phone like @KeySearch))			
					and (@type=0 or (@type<>0 and Type=@type))		

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY Id DESC) AS RowNumber 
FROM Account
where (@KeySearch='' or (@KeySearch<>'' and DisplayName like @KeySearch) 
					or (@KeySearch<>'' and Email like @KeySearch) 
					or (@KeySearch<>'' and Phone like @KeySearch))
					and (@type=0 or (@type<>0 and Type=@type))
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand

GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_ListAllPagingByStatus]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: chinhnb
-- Create date: 10/08/2016
-- Description:	
-- =============================================
CREATE procedure [dbo].[Sp_Account_ListAllPagingByStatus]

(
@type int,
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

SELECT @totalRow = COUNT(*) FROM Account where (@KeySearch='' or (@KeySearch<>'' and DisplayName like @KeySearch) 
					or (@KeySearch<>'' and Email like @KeySearch) 
					or (@KeySearch<>'' and Phone like @KeySearch))			
					and (@type=0 or (@type<>0 and Type=@type))		
					and (Status=1)

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY Id DESC) AS RowNumber 
FROM Account
where (@KeySearch='' or (@KeySearch<>'' and DisplayName like @KeySearch) 
					or (@KeySearch<>'' and Email like @KeySearch) 
					or (@KeySearch<>'' and Phone like @KeySearch))
					and (@type=0 or (@type<>0 and Type=@type))
					and (Status=1)
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand

GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_Login]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Sp_Account_Login]
 	@userName varchar(50),
 	@password varchar(50)
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM Account where (UserName=@userName or Email=@userName) and [Password]=@password and Status=1
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_LoginDevice]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CHINHNB
-- Create date: 12/07/2016
-- Description:	login
-- =============================================
CREATE PROCEDURE [dbo].[Sp_Account_LoginDevice]
 	@UserName varchar(50),
 	@Password varchar(50),
 	@DeviceMobile varchar(50)
AS
BEGIN	
	SET NOCOUNT ON;  
	--Declare @countnull int; 
	--set @countnull=(select COUNT(*) From Account where (UserName=@userName or Email=@userName) and [Password]=@password and [Type]=2 and DeviceMobile is null)
	--if(@countnull>0)
		--begin
			SELECT * FROM Account where (UserName=@userName or Email=@userName) and [Password]=@password and [Type]=2
		--end
	--else
		--begin
			--SELECT * FROM Account where (UserName=@userName or Email=@userName) and [Password]=@password and DeviceMobile=@DeviceMobile and [Type]=2
		--end
END



GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_LoginDevice_tamkhoa]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		CHINHNB
-- Create date: 12/07/2016
-- Description:	login
-- =============================================
Create PROCEDURE [dbo].[Sp_Account_LoginDevice_tamkhoa]
 	@UserName varchar(50),
 	@Password varchar(50),
 	@DeviceMobile varchar(50)
AS
BEGIN	
	SET NOCOUNT ON;  
	Declare @countnull int; 
	set @countnull=(select COUNT(*) From Account where (UserName=@userName or Email=@userName) and [Password]=@password and [Type]=2 and DeviceMobile is null)
	if(@countnull>0)
		begin
			SELECT * FROM Account where (UserName=@userName or Email=@userName) and [Password]=@password and [Type]=2
		end
	else
		begin
			SELECT * FROM Account where (UserName=@userName or Email=@userName) and [Password]=@password and DeviceMobile=@DeviceMobile and [Type]=2
		end
END



GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_Update]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*02/12/2016*/
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
	Update Account set Type=@Type,DisplayName=@DisplayName,UserName=@UserName,
						Password=@Password,Email=@Email,Status=@Status,
						Phone=@Phone,Address=@Address,BirthDay=@BirthDay,
						DeviceMobile=@DeviceMobile
	where Id=@Id		
END


GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_UpdateAvatar]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Account_UpdateAvatar] 	
 	@Id int,
 	@Avatar varchar(250)
AS
BEGIN	
	SET NOCOUNT ON; 	
	Update Account set Avatar = @Avatar
	where Id=@Id
END


GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_UpdateDevice]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[Sp_Account_UpdateDevice] 	
 	@Id int,
 	@DeviceMobile varchar(50)
AS
BEGIN	
	SET NOCOUNT ON; 	
	Update Account set DeviceMobile = @DeviceMobile
	where Id=@Id
END



GO
/****** Object:  StoredProcedure [dbo].[Sp_Account_UpdateStatus]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Account_ViewDetail]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Category_Insert]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Category_ListAllPaging]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_CheckedLocaltion]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Localtion_CheckedLocaltion] 	
 	@Id int,
	@AccountId int,
	@PlaceNumberWrong int
AS
BEGIN	
	SET NOCOUNT ON; 	
	Insert into LocaltionAccountCheck(LocaltionId,AccountId,IsCheck,Datetime,PlaceNumberWrong)	
	values(@Id,@AccountId,'true',GETDATE(),@PlaceNumberWrong)
END
GO
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_Delete]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_Insert]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Localtion_Insert] 	
	@AccountId int,
	@ProvinceId int,
	@DistrictId int,
	@CustomeType int,
 	@Name nvarchar(50),
 	@Lag varchar(50),
 	@Lng varchar(50),
 	@Email varchar(50),
 	@Phone varchar(50),
 	@Address nvarchar(250),  	
	@Avatar varchar(250),	
	@Status bit,
 	@Id int output
AS
BEGIN		
	SET NOCOUNT ON;    
	INSERT INTO Localtion(AccountId,ProvinceId,DistrictId,CustomeType, Name,Lag,Lng,Email,Phone,Address,Avatar,Status) 
	values(@AccountId,@ProvinceId, @DistrictId,@CustomeType, @Name,@Lag,@Lng,@Email,@Phone,@Address,@Avatar,@Status)
	set @Id=SCOPE_IDENTITY()
END
GO
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_ListAll]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_ListAllByAccountId]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: chinhnb
-- Create date: 10/08/2016
-- Description:	
-- =============================================
CREATE procedure [dbo].[Sp_Localtion_ListAllByAccountId] --2

(
@AccountId int,
@totalRow int output
)

as

set nocount on

SELECT @totalRow = COUNT(*) FROM Localtion where (@AccountId=0 or (@AccountId<>0 and AccountId=@AccountId)) and (Status=1)					

SELECT DISTINCT L.*,'http://103.47.192.100:8888'+ case when L.Avatar is null then '/assets/img/avatars/no-avatar.gif' else L.Avatar end as Avatar,A.UserName,C.IsCheck
FROM Localtion L left join Account A on L.AccountId=A.Id
					left join LocaltionAccountCheck C on L.AccountId=C.AccountId and L.Id=C.LocaltionId and (C.Datetime >= CAST(CURRENT_TIMESTAMP AS DATE) and C.Datetime < DATEADD(DD, 1, CAST(CURRENT_TIMESTAMP AS DATE)))
where (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId)) and (L.Status=1)
GO
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_ListAllPaging]    Script Date: 12/22/2016 10:30:50 PM ******/
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
@AccountId int,
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

SELECT @totalRow = COUNT(*) FROM Localtion where (@KeySearch='' or (@KeySearch<>'' and Name like @KeySearch) 
					or (@KeySearch<>'' and Email like @KeySearch) 
					or (@KeySearch<>'' and Phone like @KeySearch))
					and (@AccountId=0 or (@AccountId<>0 and AccountId=@AccountId))					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT L.*,A.UserName,ROW_NUMBER() OVER(ORDER BY L.Id DESC) AS RowNumber 
FROM Localtion L left join Account A on L.AccountId=A.Id
where (@KeySearch='' or (@KeySearch<>'' and L.Name like @KeySearch) 
					or (@KeySearch<>'' and L.Email like @KeySearch) 
					or (@KeySearch<>'' and L.Phone like @KeySearch))
					and (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId))
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand

GO
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_ListAllPagingByStatus]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[Sp_Localtion_ListAllPagingByStatus]

(
@AccountId int,
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

SELECT @totalRow = COUNT(*) FROM Localtion where (@KeySearch='' or (@KeySearch<>'' and Name like @KeySearch) 
					or (@KeySearch<>'' and Email like @KeySearch) 
					or (@KeySearch<>'' and Phone like @KeySearch))
					and (@AccountId=0 or (@AccountId<>0 and AccountId=@AccountId))
					and (Status=1)					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY Id DESC) AS RowNumber FROM (
SELECT DISTINCT L.*,A.UserName,C.IsCheck,C.[Datetime] as CheckDate 
FROM Localtion L 
left join Account A on L.AccountId=A.Id
left join LocaltionAccountCheck C on L.AccountId=C.AccountId and L.Id=C.LocaltionId and (C.Datetime >= CAST(CURRENT_TIMESTAMP AS DATE) and C.Datetime < DATEADD(DD, 1, CAST(CURRENT_TIMESTAMP AS DATE)))
where (@KeySearch='' or (@KeySearch<>'' and L.Name like @KeySearch) 
					or (@KeySearch<>'' and L.Email like @KeySearch) 
					or (@KeySearch<>'' and L.Phone like @KeySearch))
					and (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId))
					and (L.Status=1)
) AS temp
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand

GO
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_Update]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Localtion_Update]
	@AccountId int,
	@ProvinceId int,
	@DistrictId int,
	@CustomeType int,
 	@Name nvarchar(50),
 	@Lag varchar(50),
 	@Lng varchar(50),
 	@Email varchar(50),
 	@Phone varchar(50),
 	@Address nvarchar(250),  	
	@Avatar varchar(250),	
	@Status bit,
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	Update Localtion set AccountId=@AccountId,ProvinceId=@ProvinceId,DistrictId=@DistrictId, 
						CustomeType=@CustomeType, Name=@Name,Lag=@Lag,Lng=@Lng,Email=@Email,
						Status=@Status, Phone=@Phone,Address=@Address,Avatar=@Avatar						
	where Id=@Id		
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_UpdateStatus]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_ViewDetail]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Localtion_ViewDetailLocaltionNow]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Localtion_ViewDetailLocaltionNow] 	 	
	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	select top(1) L.*,'http://103.47.192.100:8888'+ case when L.Avatar is null then '/assets/img/avatars/no-avatar.gif' else L.Avatar end as Avatar,A.UserName,C.IsCheck,C.[Datetime] as CheckDate from Localtion L 
	left join Account A on L.AccountId=A.Id
	left join LocaltionAccountCheck C on L.AccountId=C.AccountId and L.Id=C.LocaltionId and (C.Datetime >= CAST(CURRENT_TIMESTAMP AS DATE) and C.Datetime < DATEADD(DD, 1, CAST(CURRENT_TIMESTAMP AS DATE)))
	where L.Id=@Id
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Product_Insert]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Product_ListAllPaging]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  StoredProcedure [dbo].[Sp_Province_Delete]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Sp_Province_Delete] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	delete Province where Id=@Id
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Province_Insert]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Sp_Province_Insert] 	
 	@Name nvarchar(100),
 	@Type nvarchar(30)
AS
BEGIN	
	SET NOCOUNT ON;    
	INSERT INTO Province(Name,Type) 
	values(@Name,@Type)	
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Province_ListAll]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Sp_Province_ListAll] 	
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM Province
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Province_ListAllDistrictByProvinceId]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Sp_Province_ListAllDistrictByProvinceId] 	
@ProvinceId int
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM District where ProvinceId=@ProvinceId
END

GO
/****** Object:  StoredProcedure [dbo].[Sp_Province_Update]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Sp_Province_Update] 	
 	@Name nvarchar(100),
 	@Type nvarchar(30),
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	Update Province set Name=@Name,Type=@Type
	where Id=@Id		
END

GO
/****** Object:  Table [dbo].[Account]    Script Date: 12/22/2016 10:30:50 PM ******/
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
/****** Object:  Table [dbo].[Localtion]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Localtion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AccountId] [int] NULL,
	[ProvinceId] [int] NULL,
	[DistrictId] [int] NULL,
	[CustomeType] [int] NULL,
	[Lag] [varchar](50) NULL,
	[Lng] [varchar](50) NULL,
	[Name] [nvarchar](250) NULL,
	[Avatar] [varchar](250) NULL,
	[Email] [varchar](50) NULL,
	[Phone] [varchar](50) NULL,
	[Address] [nvarchar](250) NULL,
	[CreatedDate] [datetime] NULL CONSTRAINT [DF_Location_CreatedDate]  DEFAULT (getdate()),
	[Status] [bit] NULL CONSTRAINT [DF_Localtion_Status]  DEFAULT ((1)),
 CONSTRAINT [PK_Location] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[LocaltionAccountCheck]    Script Date: 12/22/2016 10:30:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LocaltionAccountCheck](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AccountId] [int] NULL,
	[LocaltionId] [int] NULL,
	[Datetime] [datetime] NULL,
	[IsCheck] [bit] NULL CONSTRAINT [DF_LocaltionAccountCheck_IsCheck]  DEFAULT ((0)),
	[PlaceNumberWrong] [int] NULL,
 CONSTRAINT [PK_LocaltionAccountCheck] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO