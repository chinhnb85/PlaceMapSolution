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
 	@Name nvarchar(50)
AS
BEGIN	
	SET NOCOUNT ON;    
	INSERT INTO LocaltionStatus(Name) 
	values(@Name)	
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