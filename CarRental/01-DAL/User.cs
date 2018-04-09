//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace _01_DAL
{
    using System;
    using System.Collections.Generic;
    
    public partial class User
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public User()
        {
            this.RentalOrders = new HashSet<RentalOrder>();
        }
    
        public string FullName { get; set; }
        public string IdentificationNumber { get; set; }
        public string UserName { get; set; }
        public Nullable<System.DateTime> BirthDate { get; set; }
        public bool IsFemale { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int UserId { get; set; }
        public int UserRoleId { get; set; }
        public string Photo { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<RentalOrder> RentalOrders { get; set; }
        public virtual UserRole UserRole { get; set; }
    }
}
