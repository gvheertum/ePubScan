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
    Read  = { display: "Read", code: "read" };
    ToRead = { display: "To Read", code: "toread" };
    Reading = { display: "Reading", code: "reading" };
    WontRead  = { display: "Not Going To Read", code: "notgoingtoread" };
}