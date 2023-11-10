export interface IBook {
    BookID: number;
    ReadStatus?: string;
    ReadRemark?: string;
    Title?: string;
    Author?: string;
    Identifier?: string;
    Language?: string;
    Category?: string;
    Subject?: string;
    Description?: string;
    Folder?: string;
    FileName?: string;
    Status?: string;
    StatusRemark?: string;
    Medium?: string;
    NrOfPages?: number;
}


// Default update model (exposint bookId)
export interface IBookUpdateModel {
    BookID?: number;
}

// Model for saving book details (like the regular book interface)
export interface IBookDetailUpdateModel extends IBookUpdateModel {
	
    Identifier?: string;
    Title?: string;
    Author?: string;
    Description?: string;
	Medium?: string;
    NrOfPages?: number;
}

// Update the read status badge (no desc)
export interface IBookReadBadgeUpdateModel extends IBookUpdateModel {  
    ReadStatus?: string;
}

// Full read status update model (including comment)
export interface IBookReadStatusUpdateModel extends IBookReadBadgeUpdateModel {
	ReadRemark?: string;
}

// Update the availability status
export interface IBookAvailabilityStatusUpdateModel extends IBookUpdateModel {
    Status?: string;
    StatusRemark?: string;
}