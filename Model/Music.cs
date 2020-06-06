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
    
    public partial class Music
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Music()
        {
            this.FavoriteMusic = new HashSet<FavoriteMusic>();
            this.LikeMusic = new HashSet<LikeMusic>();
            this.MusicComment = new HashSet<MusicComment>();
            this.PlaylistItem = new HashSet<PlaylistItem>();
        }
    
        public int Id { get; set; }
        public string MusicName { get; set; }
        public int UploaderId { get; set; }
        public int SingerId { get; set; }
        public string Path { get; set; }
        public string ImagePath { get; set; }
        public int Likes { get; set; }
        public int PlayTimes { get; set; }
        public string Size { get; set; }
        public string Span { get; set; }
        public string Genre { get; set; }
        public System.DateTime ReleaseTime { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FavoriteMusic> FavoriteMusic { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<LikeMusic> LikeMusic { get; set; }
        public virtual Singer Singer { get; set; }
        public virtual User User { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<MusicComment> MusicComment { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PlaylistItem> PlaylistItem { get; set; }
    }
}
