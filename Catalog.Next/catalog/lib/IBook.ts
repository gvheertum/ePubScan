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



export class ReadStates {
    Read = new ReadStateElement("Read", "read");
    ToRead = new ReadStateElement("To read", "toread");
    Reading = new ReadStateElement("Reading", "reading");
    WontRead = new ReadStateElement("Not going to read", "notgoingtoread");
    Unknown: ReadStateElement = {
        display: "",
        code: "",
        matches(input?: string): boolean {
            var ns = new ReadStates();
            return !ns.Read.matches(input) &&
                !ns.ToRead.matches(input) &&
                !ns.WontRead.matches(input) &&
                !ns.Reading.matches(input);
        }
    };
}

export class ReadStateElement {
    constructor(public display: string, public code: string) { }
    matches(input?:string) : boolean { 
        return input?.toLocaleLowerCase() == this.code.toLocaleLowerCase() || 
            input?.toLocaleLowerCase() == this.display.toLocaleLowerCase();
    }
}
