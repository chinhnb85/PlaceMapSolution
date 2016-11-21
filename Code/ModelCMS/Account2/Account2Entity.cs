using System;

namespace ModelCMS.Acccount2
{
	public class Acccount2Entity
	{
		#region Properties
		/// <summary>
		/// Gets or sets the ID value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public long ID { get; set; }

		/// <summary>
		/// Gets or sets the AdminType value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public byte AdminType { get; set; }

		/// <summary>
		/// Gets or sets the UserName value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public string UserName { get; set; }

		/// <summary>
		/// Gets or sets the Password value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public string Password { get; set; }

		/// <summary>
		/// Gets or sets the FirstName value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public string FirstName { get; set; }

		/// <summary>
		/// Gets or sets the LastName value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public string LastName { get; set; }

        public string Address { set; get; }

		/// <summary>
		/// Gets or sets the CodePostal value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public string CodePostal { get; set; }

		/// <summary>
		/// Gets or sets the City value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public string City { get; set; }

		/// <summary>
		/// Gets or sets the Country value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public int Country { get; set; }

		/// <summary>
		/// Gets or sets the HomePhone value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public string Phone { get; set; }
		public string Phone2 { get; set; }

        public string CountryName { get; set; }

		

		
		/// <summary>
		/// Gets or sets the Email value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public string Email { get; set; }

		/// <summary>
		/// Gets or sets the DateOfBirth value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public DateTime? DateOfBirth { get; set; }

		/// <summary>
		/// Gets or sets the PlaceOfBirth value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public string PlaceOfBirth { get; set; }


        /// <summary>
        /// Gets or sets the Gender value.
        /// </summary>
        public int Gender { get; set; }

   
		/// <summary>
		/// Gets or sets the CreatedDate value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public DateTime? CreatedDate { get; set; }

		/// <summary>
		/// Gets or sets the LastModifiedDate value.
		/// 2015-03-17 11:12:54Z
		/// </summary>
		public DateTime? LastModifiedDate { get; set; }
        public string Photo { get; set; }
        public string BirthCity { get; set; }
        public int BirthCountry { get; set; }
        public long SyndicId { get; set; }
        public string SyndicName { get; set; }
        public string NotiSendMail { get; set; }
        public int NewNoti { get; set; }
        public int NewMess { get; set; }

		#endregion
	}
}
