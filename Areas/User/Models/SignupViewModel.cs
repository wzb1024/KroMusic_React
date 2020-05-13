using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace KroMusic.Areas.User.Models
{
    public class SignupViewModel
    {
        [Required(ErrorMessage = "请填写用户名！")]
        [StringLength(10, MinimumLength = 3, ErrorMessage = "用户名长度为3~10")]
        [Display(Name = "用户名")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "请填写密码！")]
        [StringLength(16, MinimumLength = 6,ErrorMessage ="密码长度为6~16")]
        [DataType(DataType.Password)]
        [Display(Name = "密码")]
        public string Password { get; set; }
        //[Compare("Password",ErrorMessage ="与密码不一致！")]
        //[Display(Name = "确认密码")]
        //[DataType(DataType.Password)]

        //public string PasswordConfirm { get; set; }
        [Required(ErrorMessage = "请填写昵称！")]
        [StringLength(6, MinimumLength = 3,ErrorMessage ="昵称长度为3~6")]
        [Display(Name = "昵称")]
        public string NickName { get; set; }
        [Required(ErrorMessage = "请填写性别！")]
        [Display(Name = "性别")]
        public string Gender { get; set; }
        [Required(ErrorMessage = "请填写年龄！")]
        [Range(6, 99,ErrorMessage ="非法年龄！")]
        [Display(Name = "年龄")]
        public int Age { get; set; }
        [Required(ErrorMessage = "请填写邮箱！")]
        [EmailAddress]
        [Display(Name = "邮箱")]
        public string Email { get; set; }
    }
}