namespace KroMusic.Areas.Music.Data
{
    public class PlaylistViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsPublic { get; set; }
        public string Description { get; set; }
        public int[] Tags { get; set; }
    }
}