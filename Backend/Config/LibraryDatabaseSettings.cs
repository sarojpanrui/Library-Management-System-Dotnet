namespace Library.Config
{

    public class LibraryDataBaseSettings
    {
        public string ConnectionString { get; set; }

        public string DatabaseName { get; set; }

        public string AuthCollection { get; set; }

        public string RefreshTokenCollection { get; set; } = null!; 


        public string BookCollection { get; set; }


    }

}