namespace Catalog.API.Models
{
    public class BookAvailabilityStatusUpdateModel : BookRequestModel
    {
        public string Status { get; set; } 
        public string StatusRemark { get; set; }
    }
}