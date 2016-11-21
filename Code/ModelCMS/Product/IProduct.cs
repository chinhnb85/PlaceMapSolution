using System.Collections.Generic;

namespace ModelCMS.Product
{
	public interface IProduct
    {
		long Insert(ProductEntity obj);		
        bool Update(ProductEntity obj);	    
        bool Delete(long id);
		List<ProductEntity> ListAll();
        List<ProductEntity> ListAllPaging(ProductEntity productInfo, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow);
		ProductEntity ViewDetail(string id);	    
	}
}
