declare var ko : any;
declare var $ : any;

class BookCollection
{
	public LoadFromServer() : void
	{
		$.getJSON("/api/books/all/", function(data : Array<IBook>) { 
			// Now use this data to update your view models, 
			// and Knockout will update your UI automatically 
			console.log(data);
		})
	}
}

interface IBook
{
	author: string;
	bookID: number;
	category: string;
	description: string;
	fileName: string;
	folder: string;
	identifier: string;
	language: string;
	medium: string;
	readRemark: string;
	readStatus: string;
	status: string;
	statusRemark: string;
	subject: string;
	title: string;
}