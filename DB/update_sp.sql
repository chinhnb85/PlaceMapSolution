/*02/12/2016*/

go
ALTER PROCEDURE [dbo].[Sp_Account_Update]
 	@ParentId int,
	@ProvinceId int,
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
	Update Account set  ParentId=@ParentId,ProvinceId=@ProvinceId, Type=@Type,DisplayName=@DisplayName,
						UserName=@UserName,Password=@Password,Email=@Email,Status=@Status,
						Phone=@Phone,Address=@Address,BirthDay=@BirthDay,
						DeviceMobile=@DeviceMobile
	where Id=@Id		
END

GO

ALTER PROCEDURE [dbo].[Sp_Account_Insert]
 	@ParentId int,
	@ProvinceId int,
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
	INSERT INTO Account(ParentId,ProvinceId,Type,DisplayName,UserName,Password,Email,Phone,Address,BirthDay,DeviceMobile,Status) 
	values(@ParentId,@ProvinceId,@Type,@DisplayName,@UserName,@Password,@Email,@Phone,@Address,@BirthDay,@DeviceMobile,@Status)
	set @Id=SCOPE_IDENTITY()
END
Go

------------------sp Account Place
CREATE PROCEDURE [dbo].[Sp_AccountPlace_Insert] 	
	@AccountId int,	
 	@Lag varchar(50),
 	@Lng varchar(50), 			
 	@Id int output
AS
BEGIN		
	SET NOCOUNT ON;    
	INSERT INTO AccountPlace(AccountId,Lag,Lng) 
	values(@AccountId,@Lag,@Lng)
	set @Id=SCOPE_IDENTITY()
END

Go

CREATE PROCEDURE [dbo].[Sp_AccountPlace_Delete] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	delete AccountPlace where Id=@Id
END

Go

CREATE PROCEDURE [dbo].[Sp_AccountPlace_Update]
	@AccountId int,	
 	@Lag varchar(50),
 	@Lng varchar(50), 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	Update AccountPlace set AccountId=@AccountId,Lag=@Lag,Lng=@Lng						
	where Id=@Id		
END
go
CREATE PROCEDURE [dbo].[Sp_AccountPlace_ListAll] 	
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM AccountPlace
END
go
CREATE procedure [dbo].[Sp_AccountPlace_ListAllByAccountIdAndDatetime] --2

(
@AccountId int,
@Datetime datetime,
@totalRow int output
)

as

set nocount on

SELECT @totalRow = COUNT(*) FROM AccountPlace where (AccountId=@AccountId) and (cast([Datetime] as date)=cast(@Datetime as date))

SELECT DISTINCT L.*
FROM AccountPlace L left join Account A on L.AccountId=A.Id					
where (L.AccountId=@AccountId) and (cast([Datetime] as date)=cast(@Datetime as date))
go

CREATE procedure [dbo].[Sp_AccountPlace_ListAllPaging]

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

SELECT @totalRow = COUNT(*) FROM AccountPlace where (@KeySearch='' or (@KeySearch<>'' and Lag like @KeySearch) 
					or (@KeySearch<>'' and Lng like @KeySearch)) 					
					and (@AccountId=0 or (@AccountId<>0 and AccountId=@AccountId))					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT L.*,ROW_NUMBER() OVER(ORDER BY L.Id DESC) AS RowNumber 
FROM AccountPlace L left join Account A on L.AccountId=A.Id
where (@KeySearch='' or (@KeySearch<>'' and L.Lag like @KeySearch) 
					or (@KeySearch<>'' and L.Lng like @KeySearch))					
					and (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId))
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand

go

CREATE PROCEDURE [dbo].[Sp_AccountPlace_ViewDetail] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	select * from AccountPlace where Id=@Id
END

go

ALTER procedure [dbo].[Sp_Account_ListAllPaging]

(
@type int,
@parentId int,
@provinceId int,
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
					and (@parentId=0 or (@parentId<>0 and ParentId=@parentId))
					and (@provinceId=0 or (@provinceId<>0 and ProvinceId=@provinceId))		

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY Id DESC) AS RowNumber 
FROM Account
where (@KeySearch='' or (@KeySearch<>'' and DisplayName like @KeySearch) 
					or (@KeySearch<>'' and Email like @KeySearch) 
					or (@KeySearch<>'' and Phone like @KeySearch))
					and (@type=0 or (@type<>0 and Type=@type))
					and (@parentId=0 or (@parentId<>0 and ParentId=@parentId))
					and (@provinceId=0 or (@provinceId<>0 and ProvinceId=@provinceId))
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand

go
ALTER PROCEDURE [dbo].[Sp_Account_ListAllByType] 	
(
@type int
)
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM Account where Type=@type and Status=1
END

GO
CREATE PROCEDURE [dbo].[Sp_LocaltionAccountCheck_ListAllByAccountId]
	@AccountId int,
	@StartDate datetime,
	@EndDate datetime,
	@pageIndex int,
	@pageSize int,	
	@totalRow int output
AS
BEGIN	
	SET NOCOUNT ON; 
	DECLARE @UpperBand int, @LowerBand int

SELECT @totalRow = COUNT(*) FROM LocaltionAccountCheck where (AccountId=@AccountId) and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
select * from(	
	select AC.AccountId,AC.LocaltionId,AC.[Datetime] as CheckDate,A.DisplayName as Name,L.Name as [Address], ROW_NUMBER() OVER(ORDER BY AC.Id DESC) AS RowNumber 
	from LocaltionAccountCheck as AC 
	left join Account as A on AC.AccountId=A.Id
	left join Localtion as L on AC.LocaltionId=L.Id
	where (AC.AccountId=@AccountId) and (cast(AC.[Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
)AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand
END
go

ALTER PROCEDURE [dbo].[Sp_Localtion_Insert] 	
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
	@Code varchar(50),
 	@RepresentActive nvarchar(50),
 	@Id int output
AS
BEGIN		
	SET NOCOUNT ON;    
	INSERT INTO Localtion(AccountId,ProvinceId,DistrictId,CustomeType, Name,Lag,Lng,Email,Phone,Address,Avatar,Status,Code,RepresentActive) 
	values(@AccountId,@ProvinceId, @DistrictId,@CustomeType, @Name,@Lag,@Lng,@Email,@Phone,@Address,@Avatar,@Status,@Code,@RepresentActive)
	set @Id=SCOPE_IDENTITY()
END

go

ALTER PROCEDURE [dbo].[Sp_Localtion_Update]
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
	@Code varchar(50),
 	@RepresentActive nvarchar(50),
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	Update Localtion set AccountId=@AccountId,ProvinceId=@ProvinceId,DistrictId=@DistrictId, 
						CustomeType=@CustomeType, Name=@Name,Lag=@Lag,Lng=@Lng,Email=@Email,
						Status=@Status, Phone=@Phone,Address=@Address,Avatar=@Avatar,Code=@Code,RepresentActive=@RepresentActive						
	where Id=@Id		
END

go

--update sp 09/01/2017

GO
ALTER PROCEDURE [dbo].[Sp_LocaltionAccountCheck_ListAllByAccountId]
	@AccountId int,
	@StartDate datetime,
	@EndDate datetime,
	@pageIndex int,
	@pageSize int,	
	@totalRow int output
AS
BEGIN	
	SET NOCOUNT ON; 
	DECLARE @UpperBand int, @LowerBand int

SELECT @totalRow = COUNT(*) FROM LocaltionAccountCheck where (AccountId=@AccountId) and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
select * from(	
	select AC.AccountId,AC.LocaltionId,AC.[Datetime] as CheckDate,L.Name as Name,L.Phone as Phone,L.[Address] as [Address], ROW_NUMBER() OVER(ORDER BY AC.Id DESC) AS RowNumber 
	from LocaltionAccountCheck as AC 
	left join Account as A on AC.AccountId=A.Id
	left join Localtion as L on AC.LocaltionId=L.Id
	where (AC.AccountId=@AccountId) and (cast(AC.[Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
)AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand
END

go

CREATE PROCEDURE [dbo].[Sp_LocaltionAccountCheck_ListAllByLocaltionId]
	@LocaltionId int,
	@StartDate datetime,
	@EndDate datetime,
	@pageIndex int,
	@pageSize int,	
	@totalRow int output
AS
BEGIN	
	SET NOCOUNT ON; 
	DECLARE @UpperBand int, @LowerBand int

SELECT @totalRow = COUNT(*) FROM LocaltionAccountCheck where (LocaltionId=@LocaltionId) and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
select * from(	
	select AC.AccountId,AC.LocaltionId,AC.[Datetime] as CheckDate,A.DisplayName as Name,L.Phone as Phone,L.[Address] as [Address], ROW_NUMBER() OVER(ORDER BY AC.Id DESC) AS RowNumber 
	from LocaltionAccountCheck as AC 
	left join Account as A on AC.AccountId=A.Id
	left join Localtion as L on AC.LocaltionId=L.Id
	where (AC.LocaltionId=@LocaltionId) and (cast(AC.[Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
)AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand
END

go

ALTER PROCEDURE [dbo].[Sp_Localtion_ListAll] 	
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM Localtion where [Status]=1
END

go
GO
CREATE PROCEDURE [dbo].[Sp_LocaltionAccountCheck_GetCountCheckIn]
	@LocaltionId int,	
	@countCheckIn int output
AS
BEGIN	
	SET NOCOUNT ON; 	
	SELECT @countCheckIn = COUNT(*) FROM LocaltionAccountCheck where (LocaltionId=@LocaltionId) --and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))					
END
