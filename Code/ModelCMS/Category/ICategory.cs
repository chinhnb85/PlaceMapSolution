using System.Collections.Generic;

namespace ModelCMS.Category
{
	public interface ICategory
    {
		long Insert(CategoryEntity obj);		
        bool Update(CategoryEntity obj);	    
        bool Delete(long id);
		List<CategoryEntity> ListAll();
        List<CategoryEntity> ListAllPaging(CategoryEntity categoryInfo, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow);
		CategoryEntity ViewDetail(string id);	    
	}
}
