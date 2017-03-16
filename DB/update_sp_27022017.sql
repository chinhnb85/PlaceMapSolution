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

--update 04/03/2017

GO
ALTER PROCEDURE [dbo].[Sp_Localtion_ViewDetailLocaltionNow] 	 	
	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	select top(1) L.*,case when L.Avatar is null then '/assets/img/avatars/no-avatar.gif' else L.Avatar end as Avatar,A.UserName,C.IsCheck,C.[Datetime] as CheckDate,LS.Name as StatusName
	from Localtion L 
	left join Account A on L.AccountId=A.Id
	left join LocaltionStatus LS on L.Status=LS.Id
	left join LocaltionAccountCheck C on L.AccountId=C.AccountId and L.Id=C.LocaltionId and (C.Datetime >= CAST(CURRENT_TIMESTAMP AS DATE) and C.Datetime < DATEADD(DD, 1, CAST(CURRENT_TIMESTAMP AS DATE)))
	where L.Id=@Id
END

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

SELECT DISTINCT L.*,case when L.Avatar is null then '/assets/img/avatars/no-avatar.gif' else L.Avatar end as Avatar,A.UserName,C.IsCheck,LS.Name as StatusName
FROM Localtion L 
left join Account A on L.AccountId=A.Id
left join LocaltionStatus LS on L.Status=LS.Id
left join LocaltionAccountCheck C on L.AccountId=C.AccountId and L.Id=C.LocaltionId and (C.Datetime >= CAST(CURRENT_TIMESTAMP AS DATE) and C.Datetime < DATEADD(DD, 1, CAST(CURRENT_TIMESTAMP AS DATE)))
where (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId)) and (L.Status=1)

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

SELECT DISTINCT L.*,case when L.Avatar is null then '/assets/img/avatars/no-avatar.gif' else L.Avatar end as Avatar,A.UserName,C.IsCheck,LS.Name as StatusName
FROM Localtion L 
left join Account A on L.AccountId=A.Id
left join LocaltionStatus LS on L.Status=LS.Id
left join LocaltionAccountCheck C on L.AccountId=C.AccountId and L.Id=C.LocaltionId and (C.Datetime >= CAST(CURRENT_TIMESTAMP AS DATE) and C.Datetime < DATEADD(DD, 1, CAST(CURRENT_TIMESTAMP AS DATE)))
where (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId)) and (L.Status<>2)

go
--update 10032017 23h
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
	if((select count(*) from Localtion where Name=@Name and Lag=@Lag and Lng=@Lng)=0) 
		BEGIN 
		INSERT INTO Localtion(AccountId,ProvinceId,DistrictId,CustomeType, Name,Lag,Lng,Email,Phone,Address,Avatar,Status,Code,RepresentActive,MinCheckin,StatusEdit) 
		values(@AccountId,@ProvinceId, @DistrictId,@CustomeType, @Name,@Lag,@Lng,@Email,@Phone,@Address,@Avatar,@Status,@Code,@RepresentActive,@MinCheckin,@StatusEdit)
		set @Id=SCOPE_IDENTITY()
		END
	else
		BEGIN
		set @Id=0
		END
END

--declare @Id int
--exec [dbo].[Sp_Localtion_Insert] 2,1,9,0,'134/15 Quan Nhân','21.1124912','105.7174682','abc@123.com','1323656566','134/15 Quan Nhân, Thanh Xuân, Hà Nội, Việt Nam','/Upload/Localtion/IMG_20170211_001334_78.jpg',1,'C00000001233','Anh K',3,1,@Id out
--select @Id

go
ALTER procedure [dbo].[Sp_AccountPlace_ListAllByAccountIdAndDatetime]

(
@AccountId int,
@Datetime datetime,
@totalRow int output
)

as
BEGIN
	SET NOCOUNT ON;
	SELECT @totalRow = COUNT(*) FROM AccountPlace where (AccountId=@AccountId) and (cast([Datetime] as date)=cast(@Datetime as date))

	SELECT DISTINCT L.*
	FROM AccountPlace L left join Account A on L.AccountId=A.Id					
	where (L.AccountId=@AccountId) and (cast([Datetime] as date)=cast(@Datetime as date)) and (Lag<>'0.0' or Lng<>'0.0')
END

--update 12/03/2017

GO
CREATE PROCEDURE [dbo].[Sp_Localtion_UpdateLocaltionByAccountId] 	
 	@isAll bit,
	@userIdA int,
	@userIdB int,
	@listLocaltionId varchar(50)
AS
BEGIN	
	SET NOCOUNT ON; 	
	if(@isAll=1)
	begin
		Update Localtion set [AccountId] = @userIdB 
		where [AccountId]=@userIdA
	end
	else
	begin
		Update Localtion set [AccountId] = @userIdB 
		where [AccountId]=@userIdA and Id in (Select ParsedString From [dbo].ParseStringList(@listLocaltionId))
	end
END

--exec Sp_Localtion_UpdateLocaltionByAccountId 0,2,3,'2046,21,19,16'

go

CREATE Function [dbo].[ParseStringList]  (@StringArray nvarchar(max) )  
Returns @tbl_string Table  (ParsedString nvarchar(max))  As  

BEGIN 

DECLARE @end Int,
        @start Int

SET @stringArray =  @StringArray + ',' 
SET @start=1
SET @end=1

WHILE @end<Len(@StringArray)
    BEGIN
        SET @end = CharIndex(',', @StringArray, @end)
        INSERT INTO @tbl_string 
            SELECT
                Substring(@StringArray, @start, @end-@start)

        SET @start=@end+1
        SET @end = @end+1
    END

RETURN
END

--sp 14/03/2017
GO

CREATE TABLE [dbo].[SchedulerCheckin](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AccountId] [int] NULL,
	[LocaltionId] [int] NULL,
	[StartDate] [datetime] NULL,
	[EndDate] [datetime] NULL,
	[Description] [nvarchar](500) NULL,
 CONSTRAINT [PK_SchedulerCheckin] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

CREATE PROCEDURE [dbo].[Sp_SchedulerCheckin_GetListScheduleCheckinByUserId]
	@AccountId int,
	@StartDate datetime,
	@EndDate datetime
AS
BEGIN	
	SET NOCOUNT ON; 
	SELECT * FROM SchedulerCheckin where AccountId=@AccountId
END

-----15/03/2017
GO
CREATE PROCEDURE [dbo].[Sp_SchedulerCheckin_Insert] 	
 	@AccountId int,
	@LocaltionId int,
	@StartDate datetime,
	@EndDate datetime,
	@Description nvarchar(500),
	@Id int output
AS
BEGIN	
	SET NOCOUNT ON;    
	INSERT INTO SchedulerCheckin(AccountId,LocaltionId,StartDate,EndDate,[Description]) 
	values(@AccountId,@LocaltionId,@StartDate,@EndDate,@Description)	
	set @Id=SCOPE_IDENTITY()
END

go
CREATE PROCEDURE [dbo].[Sp_SchedulerCheckin_Update] 
	@Id int,	
 	@AccountId int,
	@LocaltionId int,
	@StartDate datetime,
	@EndDate datetime,
	@Description nvarchar(500)
AS
BEGIN	
	SET NOCOUNT ON;    
	Update SchedulerCheckin set AccountId=@AccountId,LocaltionId=@LocaltionId,StartDate=@StartDate,EndDate=@EndDate,[Description]=@Description
	where AccountId=@AccountId and LocaltionId=@LocaltionId	
END

GO

CREATE PROCEDURE [dbo].[Sp_SchedulerCheckin_Delete] 	 	
	@Id int,
	@AccountId int,
	@LocaltionId int,
	@StartDate datetime,
	@EndDate datetime,
	@Description nvarchar(500)
AS
BEGIN	
	SET NOCOUNT ON;    
	delete SchedulerCheckin where AccountId=@AccountId and LocaltionId=@LocaltionId
END

go
ALTER PROCEDURE [dbo].[Sp_SchedulerCheckin_Update] 
	@Id int,	
 	@AccountId int,
	@LocaltionId int,
	@StartDate datetime,
	@EndDate datetime,
	@Description nvarchar(500)
AS
BEGIN	
	SET NOCOUNT ON;    
	Update SchedulerCheckin set AccountId=@AccountId,LocaltionId=@LocaltionId,StartDate=@StartDate,EndDate=@EndDate,[Description]=@Description
	where Id=@Id
END

go
ALTER PROCEDURE [dbo].[Sp_SchedulerCheckin_Delete] 	 	
	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	delete SchedulerCheckin where Id=@Id
END

--thống kê
GO
CREATE procedure [dbo].[Sp_Statistic_ListStatisticPaging]

(
@startDate datetime,
@endDate datetime,
@pageIndex int,
@pageSize int,
@totalRow int output
)

as
begin
set nocount on

--get tống số khách hàng của từng user
DECLARE @SumAll TABLE(Id int, SumAll int)
INSERT @SumAll (Id,SumAll) 
select AccountId,COUNT(AccountId) as SumAll 
from Localtion
where [Status]<>2
group by AccountId

--get tổng số checkin trong tháng của từng user
DECLARE @SumCheckInMonth TABLE(Id int, SumCheckInMonth int)
INSERT @SumCheckInMonth (Id,SumCheckInMonth)
select AccountId, COUNT(AccountId) as SumCheckInMonth 
from LocaltionAccountCheck
where IsCheck=1 and AccountId<>0 and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
group by AccountId

--get những địa điểm đã check in đủ 3/tháng
DECLARE @MinCheckIn TABLE(Id int, MinCheckIn int)
INSERT @MinCheckIn (Id,MinCheckIn)
select LocaltionId, COUNT(LocaltionId) as MinCheckIn 
from LocaltionAccountCheck
where IsCheck=1 and LocaltionId<>0 and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
group by LocaltionId
having COUNT(LocaltionId)>=3

--số lần user checin >=3/thang
DECLARE @FullMinCheckInMonth TABLE(Id int, FullMinCheckInMonth int)
INSERT @FullMinCheckInMonth (Id,FullMinCheckInMonth)
select L.AccountId,COUNT(L.AccountId) as FullMinCheckInMonth 
from @MinCheckIn as M
left join Localtion as L on M.Id=L.Id
where L.AccountId is not null
group by L.AccountId

--list table
DECLARE @ALL TABLE(Id int,UserName varchar(50),FullName nvarchar(50), SumAll int, SumCheckInMonth int, FullMinCheckInMonth int)
INSERT @All (Id,UserName,FullName,SumAll,SumCheckInMonth,FullMinCheckInMonth)
select A.Id,A.UserName,A.DisplayName,SA.SumAll,SC.SumCheckInMonth,FM.FullMinCheckInMonth 
from Account as A
left join @SumAll as SA on SA.Id=A.Id
left join @SumCheckInMonth as SC on SC.Id=SA.Id
left join @FullMinCheckInMonth as FM on FM.Id=SA.Id
where A.Status=1 and A.Type=2


--phan trang
DECLARE @UpperBand int, @LowerBand int

SELECT @totalRow = COUNT(*) FROM @ALL				

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY A.Id ASC) AS RowNumber 
FROM @ALL A 
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand
end

--export thống kê
GO
CREATE procedure [dbo].[Sp_Statistic_GetExportData]

(
@startDate datetime,
@endDate datetime
)

as
begin
set nocount on

--get tống số khách hàng của từng user
DECLARE @SumAll TABLE(Id int, SumAll int)
INSERT @SumAll (Id,SumAll) 
select AccountId,COUNT(AccountId) as SumAll 
from Localtion
where [Status]<>2
group by AccountId

--get tổng số checkin trong tháng của từng user
DECLARE @SumCheckInMonth TABLE(Id int, SumCheckInMonth int)
INSERT @SumCheckInMonth (Id,SumCheckInMonth)
select AccountId, COUNT(AccountId) as SumCheckInMonth 
from LocaltionAccountCheck
where IsCheck=1 and AccountId<>0 and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
group by AccountId

--get những địa điểm đã check in đủ 3/tháng
DECLARE @MinCheckIn TABLE(Id int, MinCheckIn int)
INSERT @MinCheckIn (Id,MinCheckIn)
select LocaltionId, COUNT(LocaltionId) as MinCheckIn 
from LocaltionAccountCheck
where IsCheck=1 and LocaltionId<>0 and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
group by LocaltionId
having COUNT(LocaltionId)>=3

--số lần user checin >=3/thang
DECLARE @FullMinCheckInMonth TABLE(Id int, FullMinCheckInMonth int)
INSERT @FullMinCheckInMonth (Id,FullMinCheckInMonth)
select L.AccountId,COUNT(L.AccountId) as FullMinCheckInMonth 
from @MinCheckIn as M
left join Localtion as L on M.Id=L.Id
where L.AccountId is not null
group by L.AccountId

--list table
select A.Id,A.UserName,A.DisplayName as FullName,SA.SumAll,SC.SumCheckInMonth,FM.FullMinCheckInMonth 
from Account as A
left join @SumAll as SA on SA.Id=A.Id
left join @SumCheckInMonth as SC on SC.Id=SA.Id
left join @FullMinCheckInMonth as FM on FM.Id=SA.Id
where A.Status=1 and A.Type=2
end

go
----alter 16/03/2017
ALTER procedure [dbo].[Sp_Statistic_ListStatisticPaging]

(
@startDate datetime,
@endDate datetime,
@pageIndex int,
@pageSize int,
@totalRow int output
)

as
begin
set nocount on

--get tống số khách hàng của từng user
DECLARE @SumAll TABLE(Id int, SumAll int)
INSERT @SumAll (Id,SumAll) 
select AccountId,COUNT(AccountId) as SumAll 
from Localtion
where [Status]<>2
group by AccountId

--get tổng số checkin trong tháng của từng user
DECLARE @SumCheckInMonth TABLE(Id int, SumCheckInMonth int)
INSERT @SumCheckInMonth (Id,SumCheckInMonth)
select LC.AccountId, COUNT(LC.AccountId) as SumCheckInMonth 
from LocaltionAccountCheck LC
inner join Localtion as L on L.Id=LC.LocaltionId
where IsCheck=1 and LC.AccountId<>0 and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
group by LC.AccountId

--get những địa điểm đã check in đủ MinCheckIn/tháng
DECLARE @MinCheckInTemp TABLE(Id int, MinCheckIn int)
INSERT @MinCheckInTemp (Id,MinCheckIn)
select LocaltionId, COUNT(LocaltionId) as MinCheckIn 
from LocaltionAccountCheck
inner join Localtion as L on L.Id=LocaltionId
where IsCheck=1 and LocaltionId<>0 and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
group by LocaltionId

--so sánh >= MinCheckIn
DECLARE @MinCheckIn TABLE(Id int, MinCheckIn int)
INSERT @MinCheckIn (Id,MinCheckIn)
select MC.* from @MinCheckInTemp as MC
inner join Localtion as L on L.Id=MC.Id
where MC.MinCheckIn>=L.MinCheckin

--số lần user checin >=3/thang
DECLARE @FullMinCheckInMonth TABLE(Id int, FullMinCheckInMonth int)
INSERT @FullMinCheckInMonth (Id,FullMinCheckInMonth)
select L.AccountId,COUNT(L.AccountId) as FullMinCheckInMonth 
from @MinCheckIn as M
left join Localtion as L on M.Id=L.Id
where L.AccountId is not null
group by L.AccountId

--list table
DECLARE @ALL TABLE(Id int,UserName varchar(50),FullName nvarchar(50), SumAll int, SumCheckInMonth int, FullMinCheckInMonth int)
INSERT @All (Id,UserName,FullName,SumAll,SumCheckInMonth,FullMinCheckInMonth)
select A.Id,A.UserName,A.DisplayName,SA.SumAll,SC.SumCheckInMonth,FM.FullMinCheckInMonth 
from Account as A
left join @SumAll as SA on SA.Id=A.Id
left join @SumCheckInMonth as SC on SC.Id=SA.Id
left join @FullMinCheckInMonth as FM on FM.Id=SA.Id
where A.Status=1 and A.Type=2


--phan trang
DECLARE @UpperBand int, @LowerBand int

SELECT @totalRow = COUNT(*) FROM @ALL				

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
SELECT * FROM (
SELECT *,ROW_NUMBER() OVER(ORDER BY A.Id DESC) AS RowNumber 
FROM @ALL A 
) AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand
end

go
GO
ALTER procedure [dbo].[Sp_Statistic_GetExportData]

(
@startDate datetime,
@endDate datetime
)

as
begin
set nocount on

--get tống số khách hàng của từng user
DECLARE @SumAll TABLE(Id int, SumAll int)
INSERT @SumAll (Id,SumAll) 
select AccountId,COUNT(AccountId) as SumAll 
from Localtion
where [Status]<>2
group by AccountId

--get tổng số checkin trong tháng của từng user
DECLARE @SumCheckInMonth TABLE(Id int, SumCheckInMonth int)
INSERT @SumCheckInMonth (Id,SumCheckInMonth)
select LC.AccountId, COUNT(LC.AccountId) as SumCheckInMonth 
from LocaltionAccountCheck LC
inner join Localtion as L on L.Id=LC.LocaltionId
where IsCheck=1 and LC.AccountId<>0 and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
group by LC.AccountId

--get những địa điểm đã check in đủ MinCheckIn/tháng
DECLARE @MinCheckInTemp TABLE(Id int, MinCheckIn int)
INSERT @MinCheckInTemp (Id,MinCheckIn)
select LocaltionId, COUNT(LocaltionId) as MinCheckIn 
from LocaltionAccountCheck
inner join Localtion as L on L.Id=LocaltionId
where IsCheck=1 and LocaltionId<>0 and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
group by LocaltionId

--so sánh >= MinCheckIn
DECLARE @MinCheckIn TABLE(Id int, MinCheckIn int)
INSERT @MinCheckIn (Id,MinCheckIn)
select MC.* from @MinCheckInTemp as MC
inner join Localtion as L on L.Id=MC.Id
where MC.MinCheckIn>=L.MinCheckin

--số lần user checin >=3/thang
DECLARE @FullMinCheckInMonth TABLE(Id int, FullMinCheckInMonth int)
INSERT @FullMinCheckInMonth (Id,FullMinCheckInMonth)
select L.AccountId,COUNT(L.AccountId) as FullMinCheckInMonth 
from @MinCheckIn as M
left join Localtion as L on M.Id=L.Id
where L.AccountId is not null
group by L.AccountId

--list table
select A.Id,A.UserName,A.DisplayName as FullName,SA.SumAll,SC.SumCheckInMonth,FM.FullMinCheckInMonth 
from Account as A
left join @SumAll as SA on SA.Id=A.Id
left join @SumCheckInMonth as SC on SC.Id=SA.Id
left join @FullMinCheckInMonth as FM on FM.Id=SA.Id
where A.Status=1 and A.Type=2
order by A.Id DESC
end

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

SELECT @totalRow = COUNT(*) FROM LocaltionAccountCheck where (AccountId=@AccountId)and (LocaltionId<>0) and (cast([Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))					

SET @LowerBand  = (@pageIndex - 1) * @PageSize
SET @UpperBand  = (@pageIndex * @PageSize)
select * from(	
	select AC.AccountId,AC.LocaltionId,AC.[Datetime] as CheckDate,AC.ImageCheckin,L.Name as Name,L.Phone as Phone,L.[Address] as [Address], ROW_NUMBER() OVER(ORDER BY AC.Id DESC) AS RowNumber 
	from LocaltionAccountCheck as AC 
	inner join Account as A on AC.AccountId=A.Id
	inner join Localtion as L on AC.LocaltionId=L.Id
	where (AC.AccountId=@AccountId) and (AC.LocaltionId<>0) and (cast(AC.[Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
)AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand
END

GO
ALTER PROCEDURE [dbo].[Sp_LocaltionAccountCheck_ListAllByLocaltionId]
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
	select AC.AccountId,AC.LocaltionId,AC.[Datetime] as CheckDate,AC.ImageCheckin,A.DisplayName as Name,L.Phone as Phone,L.[Address] as [Address], ROW_NUMBER() OVER(ORDER BY AC.Id DESC) AS RowNumber 
	from LocaltionAccountCheck as AC 
	inner join Account as A on AC.AccountId=A.Id
	inner join Localtion as L on AC.LocaltionId=L.Id
	where (AC.LocaltionId=@LocaltionId) and (cast(AC.[Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
)AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand
END