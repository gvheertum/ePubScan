export interface IBook {
	Author?: string;
	BookID: number;
	Category?: string;
	Description?: string;
	FileName?: string;
	Folder?: string;
	Identifier?: string;
	Language?: string;
	Medium?: string;
	ReadRemark?: string;
	ReadStatus?: string;
	Status?: string;
	StatusRemark?: string;
	Subject?: string;
	Title?: string;
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