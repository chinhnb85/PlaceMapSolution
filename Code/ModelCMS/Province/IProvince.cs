using System.Collections.Generic;

namespace ModelCMS.Province
{
	public interface IProvince
    {
		long Insert(ProvinceEntity obj);		
        bool Update(ProvinceEntity obj);	    
        bool Delete(long id);		
        List<ProvinceEntity> ListAll();
        List<ProvinceEntity> ListAllDistrictByProvinceId(int provinceId);
        ProvinceEntity ViewDetail(int id);	    
	}
}
