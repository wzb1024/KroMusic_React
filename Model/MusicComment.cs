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
    
    public partial class MusicComment
    {
        public int Id { get; set; }
        public int MusicId { get; set; }
        public int UserId { get; set; }
        public int TargetId { get; set; }
        public string Content { get; set; }
        public System.DateTime Time { get; set; }
    
        public virtual Music Music { get; set; }
        public virtual User User { get; set; }
    }
}
