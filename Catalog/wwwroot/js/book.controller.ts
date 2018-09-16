class BookCollectionViewModel
{
	public Collection : KnockoutObservable<Array<Book>> = ko.observable([]);
	constructor()
	{
		this.loadFromServer();
	}
	
	public loadFromServer() : void
	{
		var _self = this;
		$.getJSON("/api/books/all/", function(data : Array<IBook>) { 
			//TODO: Check if and how we can use the .mapping from KO here. 
			//Example online states a mapping on the whole viewmodel, while we only want to do a part
			var bookArray : Array<Book> = [];
			for(var i = 0; i < data.length; i++)
			{
				bookArray.push(new Book(data[i]));
			}
			_self.Collection(bookArray);
		});
	}
}

ko.applyBindings(new BookCollectionViewModel());
class Book
{
	public constructor(input?: IBook)
	{
		if(input != null)
		{
			//Look for all properties in the input and map them to our own property functions
			for (var property in input) 
			{
				if(this[property] != null)
				{
					this[property](input[property]);
				}
			}
		}
	}
	public author: KnockoutObservable<string> = ko.observable("");
	public bookID: KnockoutObservable<number> = ko.observable(0);
	public category: KnockoutObservable<string> = ko.observable("");
	public description: KnockoutObservable<string> = ko.observable("");
	public fileName: KnockoutObservable<string> = ko.observable("");
	public folder: KnockoutObservable<string> = ko.observable("");
	public identifier: KnockoutObservable<string> = ko.observable("");
	public language: KnockoutObservable<string> = ko.observable("");
	public medium: KnockoutObservable<string> = ko.observable("");
	public readRemark: KnockoutObservable<string> = ko.observable("");
	public readStatus: KnockoutObservable<string> = ko.observable("");
	public status: KnockoutObservable<string> = ko.observable("");
	public statusRemark: KnockoutObservable<string> = ko.observable("");
	public subject: KnockoutObservable<string> = ko.observable("");
	public title: KnockoutObservable<string> = ko.observable("");
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