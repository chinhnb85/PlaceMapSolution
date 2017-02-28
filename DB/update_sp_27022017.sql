go

CREATE TABLE [dbo].[LocaltionStatus](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
 CONSTRAINT [PK_LocaltionStatus] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

CREATE PROCEDURE [dbo].[Sp_LocaltionStatus_Delete] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	delete LocaltionStatus where Id=@Id
END

GO
CREATE PROCEDURE [dbo].[Sp_LocaltionStatus_Insert] 	
 	@Name nvarchar(50),
	@Id int output
AS
BEGIN	
	SET NOCOUNT ON;    
	INSERT INTO LocaltionStatus(Name) 
	values(@Name)	
	set @Id=SCOPE_IDENTITY()
END

GO

CREATE PROCEDURE [dbo].[Sp_LocaltionStatus_ListAll] 	
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM LocaltionStatus
END
GO

CREATE PROCEDURE [dbo].[Sp_LocaltionStatus_Update] 	
 	@Name nvarchar(50), 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	Update LocaltionStatus set Name=@Name
	where Id=@Id		
END
GO
-- =============================================
-- Author: chinhnb
-- Create date: 10/08/2016
-- Description:	
-- =============================================
CREATE procedure [dbo].[Sp_LocaltionStatus_ListAllPaging]
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

SELECT @totalRow = COUNT(*) FROM LocaltionStatus where (@KeySearch='' or (@KeySearch<>'' and Name like @KeySearch))					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY Id DESC) AS RowNumber 
FROM LocaltionStatus
where (@KeySearch='' or (@KeySearch<>'' and Name like @KeySearch)) 					
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand

GO
CREATE PROCEDURE [dbo].[Sp_LocaltionStatus_ViewDetail] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	select * from LocaltionStatus where Id=@Id
END
go

--new 27022017 23h
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
	@Status int,
	@Code nvarchar(50),
 	@RepresentActive nvarchar(50),
	@MinCheckin int,
	@StatusEdit bit,
 	@Id int output
AS
BEGIN		
	SET NOCOUNT ON;    
	INSERT INTO Localtion(AccountId,ProvinceId,DistrictId,CustomeType, Name,Lag,Lng,Email,Phone,Address,Avatar,Status,Code,RepresentActive,MinCheckin,StatusEdit) 
	values(@AccountId,@ProvinceId, @DistrictId,@CustomeType, @Name,@Lag,@Lng,@Email,@Phone,@Address,@Avatar,@Status,@Code,@RepresentActive,@MinCheckin,@StatusEdit)
	set @Id=SCOPE_IDENTITY()
END

GO
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
	@Status int,
	@Code nvarchar(50),
 	@RepresentActive nvarchar(50),
	@MinCheckin int,
	@StatusEdit bit,
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	Update Localtion set AccountId=@AccountId,ProvinceId=@ProvinceId,DistrictId=@DistrictId, 
						CustomeType=@CustomeType, Name=@Name,Lag=@Lag,Lng=@Lng,Email=@Email,
						Status=@Status, Phone=@Phone,Address=@Address,Avatar=@Avatar,Code=@Code,RepresentActive=@RepresentActive,
						MinCheckin=@MinCheckin,StatusEdit=@StatusEdit												
	where Id=@Id		
END

GO
ALTER procedure [dbo].[Sp_Localtion_ListAllPaging]

(
@AccountId int,
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

SELECT @totalRow = COUNT(*) FROM Localtion L left join Account A on L.AccountId=A.Id
where (@KeySearch='' or (@KeySearch<>'' and L.Name like @KeySearch) 
					or (@KeySearch<>'' and L.Email like @KeySearch) 
					or (@KeySearch<>'' and L.Phone like @KeySearch))
					and (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId))	
					and (@parentId=0 or (@parentId<>0 and A.ParentId=@parentId))
					and (@provinceId=0 or (@provinceId<>0 and A.ProvinceId=@provinceId))				

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT L.*,A.UserName,LS.Name as StatusName,ROW_NUMBER() OVER(ORDER BY L.Id DESC) AS RowNumber 
FROM Localtion L 
left join Account A on L.AccountId=A.Id
left join LocaltionStatus LS on L.Status=LS.Id
where (@KeySearch='' or (@KeySearch<>'' and L.Name like @KeySearch) 
					or (@KeySearch<>'' and L.Email like @KeySearch) 
					or (@KeySearch<>'' and L.Phone like @KeySearch))
					and (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId))
					and (@parentId=0 or (@parentId<>0 and A.ParentId=@parentId))
					and (@provinceId=0 or (@provinceId<>0 and A.ProvinceId=@provinceId))
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand

GO
ALTER procedure [dbo].[Sp_Localtion_ListAllPagingByStatus]

(
@AccountId int,
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

SELECT @totalRow = COUNT(*) FROM Localtion L left join Account A on L.AccountId=A.Id
where (@KeySearch='' or (@KeySearch<>'' and L.Name like @KeySearch) 
					or (@KeySearch<>'' and L.Email like @KeySearch) 
					or (@KeySearch<>'' and L.Phone like @KeySearch))
					and (@AccountId=0 or (@AccountId<>0 and AccountId=@AccountId))
					and (L.Status=1)		
					and (@parentId=0 or (@parentId<>0 and A.ParentId=@parentId))
					and (@provinceId=0 or (@provinceId<>0 and A.ProvinceId=@provinceId))			

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY Id DESC) AS RowNumber FROM (
SELECT DISTINCT L.*,A.UserName,C.IsCheck,C.[Datetime] as CheckDate,LS.Name as StatusName 
FROM Localtion L 
left join Account A on L.AccountId=A.Id
left join LocaltionStatus LS on L.Status=LS.Id
left join LocaltionAccountCheck C on L.AccountId=C.AccountId and L.Id=C.LocaltionId and (C.Datetime >= CAST(CURRENT_TIMESTAMP AS DATE) and C.Datetime < DATEADD(DD, 1, CAST(CURRENT_TIMESTAMP AS DATE)))
where (@KeySearch='' or (@KeySearch<>'' and L.Name like @KeySearch) 
					or (@KeySearch<>'' and L.Email like @KeySearch) 
					or (@KeySearch<>'' and L.Phone like @KeySearch))
					and (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId))
					and (L.Status=1)
					and (@parentId=0 or (@parentId<>0 and A.ParentId=@parentId))
					and (@provinceId=0 or (@provinceId<>0 and A.ProvinceId=@provinceId))
) AS temp
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand

GO
-- =============================================
-- Author: chinhnb
-- Create date: 10/08/2016
-- Description:	
-- =============================================
CREATE procedure [dbo].[Sp_Localtion_ListAllByAccountIdAndStatus] --2

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
where (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId)) and (L.Status<>1)

go

ALTER procedure [dbo].[Sp_Localtion_GetExportData] --0,0,0,''

(
@AccountId int,
@parentId int,
@provinceId int,
@KeySearch nvarchar(250)
)

as

set nocount on

IF(@KeySearch <> '')BEGIN
		SET @KeySearch = '%' + @KeySearch + '%'
	END

SELECT L.*,A.UserName,p.Name as ProvinceName,d.Name as DistrictName,LS.Name as StatusName
FROM Localtion L 
left join Account A on L.AccountId=A.Id
left join Province p on l.ProvinceId=p.Id
left join District d on l.DistrictId=d.Id
left join LocaltionStatus LS on l.Status=LS.Id
where (@KeySearch='' or (@KeySearch<>'' and L.Name like @KeySearch) 
					or (@KeySearch<>'' and L.Email like @KeySearch) 
					or (@KeySearch<>'' and L.Phone like @KeySearch))
					and (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId))
					and (@parentId=0 or (@parentId<>0 and A.ParentId=@parentId))
					and (@provinceId=0 or (@provinceId<>0 and A.ProvinceId=@provinceId))

GO
-- =============================================
-- Author: chinhnb
-- Create date: 10/08/2016
-- Description:	
-- =============================================
ALTER procedure [dbo].[Sp_Localtion_ListAllByAccountIdAndStatus] --2

(
@AccountId int,
@totalRow int output
)

as

set nocount on

SELECT @totalRow = COUNT(*) FROM Localtion where (@AccountId=0 or (@AccountId<>0 and AccountId=@AccountId)) and (Status<>2)					

SELECT DISTINCT L.*,'http://103.47.192.100:8888'+ case when L.Avatar is null then '/assets/img/avatars/no-avatar.gif' else L.Avatar end as Avatar,A.UserName,C.IsCheck,LS.Name as StatusName
FROM Localtion L 
left join Account A on L.AccountId=A.Id
left join LocaltionStatus LS on L.Status=LS.Id
left join LocaltionAccountCheck C on L.AccountId=C.AccountId and L.Id=C.LocaltionId and (C.Datetime >= CAST(CURRENT_TIMESTAMP AS DATE) and C.Datetime < DATEADD(DD, 1, CAST(CURRENT_TIMESTAMP AS DATE)))
where (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId)) and (L.Status<>2)

GO
-- =============================================
-- Author: chinhnb
-- Create date: 10/08/2016
-- Description:	
-- =============================================
ALTER procedure [dbo].[Sp_Localtion_ListAllByAccountId] --2

(
@AccountId int,
@totalRow int output
)

as

set nocount on

SELECT @totalRow = COUNT(*) FROM Localtion where (@AccountId=0 or (@AccountId<>0 and AccountId=@AccountId)) and (Status=1)					

SELECT DISTINCT L.*,'http://103.47.192.100:8888'+ case when L.Avatar is null then '/assets/img/avatars/no-avatar.gif' else L.Avatar end as Avatar,A.UserName,C.IsCheck,LS.Name as StatusName
FROM Localtion L 
left join Account A on L.AccountId=A.Id
left join LocaltionStatus LS on L.Status=LS.Id
left join LocaltionAccountCheck C on L.AccountId=C.AccountId and L.Id=C.LocaltionId and (C.Datetime >= CAST(CURRENT_TIMESTAMP AS DATE) and C.Datetime < DATEADD(DD, 1, CAST(CURRENT_TIMESTAMP AS DATE)))
where (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId)) and (L.Status=1)

GO
ALTER PROCEDURE [dbo].[Sp_Localtion_ViewDetailLocaltionNow] 	 	
	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	select top(1) L.*,'http://103.47.192.100:8888'+ case when L.Avatar is null then '/assets/img/avatars/no-avatar.gif' else L.Avatar end as Avatar,A.UserName,C.IsCheck,C.[Datetime] as CheckDate,LS.Name as StatusName
	from Localtion L 
	left join Account A on L.AccountId=A.Id
	left join LocaltionStatus LS on L.Status=LS.Id
	left join LocaltionAccountCheck C on L.AccountId=C.AccountId and L.Id=C.LocaltionId and (C.Datetime >= CAST(CURRENT_TIMESTAMP AS DATE) and C.Datetime < DATEADD(DD, 1, CAST(CURRENT_TIMESTAMP AS DATE)))
	where L.Id=@Id
END