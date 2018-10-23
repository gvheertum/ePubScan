class PropertyCopier
{
	public static CopyElement(from: any, to: any) : any
	{
		//Look for all properties in the input and map them to our own property functions
		for (var property in from) 
		{
			if(to[property] != null) { to[property](from[property]); }
		}
		return to;
	}
}

class Book
{
	public constructor(input?: IBook)
	{
		this.ReadFromIBook(input);
	}

	public ReadFromIBook(input: IBook) : Book
	{
		PropertyCopier.CopyElement(input,this);
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
	public nrOfPages: KnockoutObservable<number> = ko.observable(null);
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
	nrOfPages: number;
}

interface IBookCollection
{
	books : Array<IBook>;
	routeGetDetails : string;
	routeUpdateDetails : string;
	routeUpdateReadStatus : string;
	routeUpdateAvailabilityStatus : string;
}

class BookCollectionViewModel
{
	public RouteGetDetails : string;
	public RouteUpdateDetails : string;
	public RouteUpdateReadStatus : string;
	public RouteUpdateAvailabilityStatus : string;

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
		console.log("Loading books from server");
		var _self = this;
		$.getJSON("/api/books/all/", function(data : IBookCollection) 
		{ 
			//TODO: Check if and how we can use the .mapping from KO here. 
			//Example online states a mapping on the whole viewmodel, while we only want to do a part
			var bookArray : Array<Book> = [];
			for(var i = 0; data.books != null && i < data.books.length; i++)
			{
				bookArray.push(new Book().ReadFromIBook(data.books[i]));
			}
			_self.Collection(bookArray);
			_self.RouteGetDetails = data.routeGetDetails;
			_self.RouteUpdateAvailabilityStatus = data.routeUpdateAvailabilityStatus;
			_self.RouteUpdateReadStatus = data.routeUpdateReadStatus;
			_self.RouteUpdateDetails = data.routeUpdateDetails;
		});
	}

	public showDetails(data: Book)
	{
		var _self = this;
		var url = this.prepRouteForBook(this.RouteGetDetails, data);
		$.getJSON(url, function(data : IBook) 
		{ 
			console.log("Loaded book detail");
			_self.ShowingActiveBook(true);
			_self.ActiveBook(new Book().ReadFromIBook(data));
			_self.scrollToTop();
		});
	}
	public backToOverview()
	{
		this.ShowingActiveBook(false);
		this.ActiveBook(new Book());
		this.scrollToTop();
		this.loadFromServer(); //TODO: smarter update, now we just reload all
	}

	public updateBookData(data: Book)
	{
		if(confirm("Are you sure you want to update the basic book details?"))
		{
			var _self = this;
			var route = this.prepRouteForBook(this.RouteUpdateDetails, data);
			console.log("Updating book data:", data, route);
			$.post(route, ko.toJSON(data), function() 
			{ 
				//TODO: Show success
			});
		}
	}

	public updateReadData(data: Book)
	{
		var _self = this;
		var route = this.prepRouteForBook(this.RouteUpdateReadStatus, data);
		console.log("Updating read data:", data, route);
		$.post(route, ko.toJSON(data), function() 
		{ 
			//TODO: Show success
		});
	}

	public updateAvailabilityData(data: Book)
	{
		var _self = this;
		var route = this.prepRouteForBook(this.RouteUpdateAvailabilityStatus, data);
		$.post(route, ko.toJSON(data), function() 
		{ 
			//TODO: Show success
		});
	}

	private prepRouteForBook(route: string, data: Book) : string
	{	
		return route.replace(/BOOKID/g, data.bookID() + "");
	}

	private scrollToTop()
	{
		$("body").scrollTop(0);
	}
}

ko.applyBindings(new BookCollectionViewModel());