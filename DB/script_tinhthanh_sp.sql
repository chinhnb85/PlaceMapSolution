USE [PlaceMap]
GO
/****** Object:  StoredProcedure [dbo].[Sp_Province_Insert]    Script Date: 12/15/2016 15:01:02 ******/
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
Go

CREATE PROCEDURE [dbo].[Sp_Province_ListAll] 	
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM Province
END
go

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
go

CREATE PROCEDURE [dbo].[Sp_Province_Delete] 	
 	@Id int
AS
BEGIN	
	SET NOCOUNT ON;    
	delete Province where Id=@Id
END
go

CREATE PROCEDURE [dbo].[Sp_Province_ListAllDistrictByProvinceId] 	
@ProvinceId int
AS
BEGIN	
	SET NOCOUNT ON;    
	SELECT * FROM District where ProvinceId=@ProvinceId
END
go