export interface IBook {
	author?: string;
	bookID: number;
	category?: string;
	description?: string;
	fileName?: string;
	folder?: string;
	identifier?: string;
	language?: string;
	medium?: string;
	readRemark?: string;
	readStatus?: string;
	status?: string;
	statusRemark?: string;
	subject?: string;
	title?: string;
	nrOfPages?: number;
}

// Default update model (exposint bookId)
export interface IBookUpdateModel {
    bookID?: number;
}

// Model for saving book details (like the regular book interface)
export interface IBookDetailUpdateModel extends IBookUpdateModel {
	
    identifier?: string;
    title?: string;
    author?: string;
    description?: string;
    medium?: string;
    nrOfPages?: number;
}

// Update the read status badge (no desc)
export interface IBookReadBadgeUpdateModel extends IBookUpdateModel {  
    readStatus?: string;
}

// Full read status update model (including comment)
export interface IBookReadStatusUpdateModel extends IBookReadBadgeUpdateModel {
	readRemark?: string;
}

// Update the availability status
export interface IBookAvailabilityStatusUpdateModel extends IBookUpdateModel {
    status?: string;
    statusRemark?: string;
}