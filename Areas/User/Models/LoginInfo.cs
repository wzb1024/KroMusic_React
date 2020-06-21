namespace KroMusic.Areas.User.Models
{
    /// <summary>
    /// 用于返回登录json数据
    /// </summary>
    public class LoginInfo
    {
        public bool Status { get; set; } = false;
        public string NikName { get; set; }
        public string Hdimg { get; set; }
        public string ErrorMsg { get; set; }
    }
}