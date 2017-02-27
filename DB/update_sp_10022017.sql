Create PROCEDURE [dbo].[Sp_Localtion_UpdateStatusEdit] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON; 	
	Update Localtion set [StatusEdit] = case when [StatusEdit]='true' then 'false' else 'true' end  
	where Id=@Id
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
	@Status bit,
	@Code varchar(50),
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
CREATE PROCEDURE [dbo].[Sp_Localtion_EditLocaltion]
	@AccountId int,		
 	@Name nvarchar(50),
 	@Lag varchar(50),
 	@Lng varchar(50), 	
 	@Phone varchar(50),
 	@Address nvarchar(250),  	
	@Avatar varchar(250),		
	@Code varchar(50), 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	Update Localtion set AccountId=@AccountId,Name=@Name,Lag=@Lag,Lng=@Lng,
						Phone=@Phone,Address=@Address,Avatar=@Avatar,Code=@Code														
	where Id=@Id		
END

GO
ALTER PROCEDURE [dbo].[Sp_Localtion_CheckedLocaltion] 	
 	@Id int,
	@AccountId int,
	@PlaceNumberWrong int,
	@ImageCheckin varchar(250)
AS
BEGIN	
	SET NOCOUNT ON; 	
	Insert into LocaltionAccountCheck(LocaltionId,AccountId,IsCheck,Datetime,PlaceNumberWrong,ImageCheckin)	
	values(@Id,@AccountId,'true',GETDATE(),@PlaceNumberWrong,@ImageCheckin)
END

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
	select AC.AccountId,AC.LocaltionId,AC.[Datetime] as CheckDate,AC.ImageCheckin,L.Name as Name,L.Phone as Phone,L.[Address] as [Address], ROW_NUMBER() OVER(ORDER BY AC.Id DESC) AS RowNumber 
	from LocaltionAccountCheck as AC 
	left join Account as A on AC.AccountId=A.Id
	left join Localtion as L on AC.LocaltionId=L.Id
	where (AC.AccountId=@AccountId) and (cast(AC.[Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
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
	left join Account as A on AC.AccountId=A.Id
	left join Localtion as L on AC.LocaltionId=L.Id
	where (AC.LocaltionId=@LocaltionId) and (cast(AC.[Datetime] as date) between cast(@StartDate as date) and cast(@EndDate as date))
)AS temp
WHERE RowNumber > @LowerBand AND RowNumber <= @UpperBand
END

go

--26/02/2017
create procedure [dbo].[Sp_Localtion_GetExportData] --0,0,0,''

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

SELECT L.*,A.UserName,p.Name as ProvinceName,d.Name as DistrictName
FROM Localtion L 
left join Account A on L.AccountId=A.Id
left join Province p on l.ProvinceId=p.Id
left join District d on l.DistrictId=d.Id
where (@KeySearch='' or (@KeySearch<>'' and L.Name like @KeySearch) 
					or (@KeySearch<>'' and L.Email like @KeySearch) 
					or (@KeySearch<>'' and L.Phone like @KeySearch))
					and (@AccountId=0 or (@AccountId<>0 and L.AccountId=@AccountId))
					and (@parentId=0 or (@parentId<>0 and A.ParentId=@parentId))
					and (@provinceId=0 or (@provinceId<>0 and A.ProvinceId=@provinceId))
