namespace Catalog.API.Models
{
    public class BookReadStatusUpdateModel
    {
        public int BookID {get; set; }  
        public string ReadStatus { get; set; } 
        public string ReadRemark { get; set; }
    }
}