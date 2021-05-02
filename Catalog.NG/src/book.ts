export interface IBook
{
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

export class ReadStates
{
    Read  = new ReadStateElement("Read", "read");
    ToRead = new ReadStateElement("To read", "toread");
    Reading = new ReadStateElement("Reading", "reading");
    WontRead  = new ReadStateElement("Not going to read", "notgoingtoread");
    Unknown = { 
        display: "", 
        code: "", 
        matches(input?:string) : boolean { 
            var ns = new ReadStates();
            return !ns.Read.matches(input) && 
                !ns.ToRead.matches(input) &&
                !ns.WontRead.matches(input) &&
                !ns.Reading.matches(input);
        } 
    }
}

class ReadStateElement {
    constructor(public display: string, public code: string) { }
    matches(input?:string) : boolean { 
        return input?.toLocaleLowerCase() == this.code.toLocaleLowerCase() || 
            input?.toLocaleLowerCase() == this.display.toLocaleLowerCase();
    }
}