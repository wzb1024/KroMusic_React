//------------------------------------------------------------------------------
// <auto-generated>
//     此代码已从模板生成。
//
//     手动更改此文件可能导致应用程序出现意外的行为。
//     如果重新生成代码，将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class Singer
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Singer()
        {
            this.Music = new HashSet<Music>();
            this.SingerAttention = new HashSet<SingerAttention>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string Image { get; set; }
        public int Age { get; set; }
        public string Nationality { get; set; }
        public int CreatorId { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Music> Music { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SingerAttention> SingerAttention { get; set; }
        public virtual User User { get; set; }
    }
}
