class Book
{
	public constructor(input?: IBook)
	{
		this.ReadFromIBook(input);
	}
	public ReadFromIBook(input: IBook)
	{
		//Look for all properties in the input and map them to our own property functions
		for (var property in input) 
		{
			if(this[property] != null) { this[property](input[property]); }
		}
		return this;
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

class BookCollectionViewModel
{
	public ShowingActiveBook : KnockoutObservable<boolean> = ko.observable(false);
	public Collection : KnockoutObservable<Array<Book>> = ko.observable([]);
	public ActiveBook : KnockoutObservable<Book> = ko.observable(new Book(null));
	public NumberOfBooks : any = ko.computed(() => { return this.Collection().length; }, this);
	public constructor()
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
				bookArray.push(new Book().ReadFromIBook(data[i]));
			}
			_self.Collection(bookArray);
		});
	}

	public showDetails(data: Book)
	{
		this.ShowingActiveBook(true);
		this.ActiveBook(data);
	}
	public backToOverview()
	{
		this.ShowingActiveBook(false);
		this.ActiveBook(new Book());
	}
}

ko.applyBindings(new BookCollectionViewModel());