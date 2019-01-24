namespace Catalog.API.Models
{
    public class BookAvailabilityStatusUpdateModel
    {
        public int BookID { get; set; } 
        public string Status { get; set; } 
        public string StatusRemark { get; set; }
    }
}