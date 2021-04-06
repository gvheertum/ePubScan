declare var Sammy : any;
declare var $CATALOGAPIROOTURL;

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
		if(input != null) 
		{
			this.ReadFromIBook(input);
		}
	}

	public ReadFromIBook(input: IBook) : Book
	{
		PropertyCopier.CopyElement(input, this);
		this.isRead = ko.observable(this.readStatus() == "Read");
		this.isToRead = ko.observable(this.readStatus() == "To read");
		this.isReading = ko.observable(this.readStatus() == "Reading");
		this.isNotGoingToRead = ko.observable(this.readStatus() == "Not going to read");
		this.isUnknown = ko.observable(!this.readStatus());
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

	public isRead: KnockoutObservable<boolean> = ko.observable(false);
	public isReading: KnockoutObservable<boolean> = ko.observable(false);
	public isToRead: KnockoutObservable<boolean> = ko.observable(false);
	public isUnknown: KnockoutObservable<boolean> = ko.observable(false);
	public isNotGoingToRead: KnockoutObservable<boolean> = ko.observable(false);
}
interface IBook
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

interface IBookCollection
{
	books : Array<IBook>;
}

class BookCollectionViewModel
{
	//TODO: this one should from the server (config??)
	public RouteRoot: string = $CATALOGAPIROOTURL;
	public RouteGetAll : string = "Books/All";
	public RouteGetDetails : string = "Book/BOOKID/Detail";
	public RouteUpdateDetails : string = "Book/BOOKID/UpdateBookData";
	public RouteUpdateReadStatus : string = "Book/BOOKID/UpdateReadStatus";
	public RouteUpdateAvailabilityStatus : string = "Book/BOOKID/UpdateAvailabilityStatus";

	public ShowingActiveBook : KnockoutObservable<boolean> = ko.observable(false);
	public Collection : KnockoutObservable<Array<Book>> = ko.observable([]);
	public ActiveBook : KnockoutObservable<Book> = ko.observable(new Book(null));
	public NumberOfBooks : any = ko.computed(() => { return this.Collection().length; }, this);
	public constructor()
	{
		var _self = this;
		// Define sammy routes for location/hash navigation
		var sammy = Sammy(function() {
			this.get('/#Detail/:bookid', function() 
			{
				var bookID = this.params.bookid;
				var dummyBook = new Book({ bookID: bookID });
				_self.loadDetails(dummyBook);	
			});
			this.get('/#Overview/', function() 
			{
				_self.loadOverview();	
			});
			//Root matches to not found, so navigate back to the overview
			this.notFound = function()
			{ 
				console.log("Not found: ", this);
			}
		});
		this.loadFromServer(() => sammy.run()); //When loaded run Sammy script
	}
	
	public loadFromServer(onComplete? : ()=>void) : void
	{
		var _self = this;
		$.getJSON(this.composeRoute(this.RouteGetAll), function(data : Array<IBook>) 
		{ 
			//TODO: Check if and how we can use the .mapping from KO here. 
			//Example online states a mapping on the whole viewmodel, while we only want to do a part
			var bookArray : Array<Book> = [];
			for(var i = 0; data != null && i < data.length; i++)
			{
				bookArray.push(new Book().ReadFromIBook(data[i]));
			}
			_self.Collection(bookArray);
			if(onComplete != null) { onComplete(); }
		});
	}

	public showDetails(data: Book)
	{
		location.hash = "Detail/" + data.bookID().toString();
	}

	private loadDetails(data: Book)
	{
		var _self = this;
		var url = this.prepRouteForBook(this.composeRoute(this.RouteGetDetails), data);
		$.getJSON(url, function(data : IBook) 
		{ 
			_self.ActiveBook(new Book().ReadFromIBook(data));
			_self.ShowingActiveBook(true);
			_self.scrollToTop();
		});
	}

	public backToOverview()
	{
		location.hash = "Overview/";
	}

	private loadOverview()
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
			var route = this.prepRouteForBook(this.composeRoute(this.RouteUpdateDetails), data);
			this.postBookToRoute(route, data, this.showSuccess.bind(this));
		}
	}

	public updateReadData(data: Book)
	{
		var _self = this;
		var route = this.prepRouteForBook(this.composeRoute(this.RouteUpdateReadStatus), data);
		this.postBookToRoute(route, data, this.showSuccess.bind(this));
	}

	public updateAvailabilityData(data: Book)
	{
		var _self = this;
		var route = this.prepRouteForBook(this.composeRoute(this.RouteUpdateAvailabilityStatus), data);
		this.postBookToRoute(route, data, this.showSuccess.bind(this));
	}

	private composeRoute(routeSuffix: string)
	{
		var r = this.RouteRoot;
		if(r.lastIndexOf("/") != r.length-1) { r += "/" };
		r = r + routeSuffix;
		console.log("Route->" + r);
		return r;
	}

	private prepRouteForBook(route: string, data: Book) : string
	{	
		return route.replace(/BOOKID/g, data.bookID() + "");
	}

	private postBookToRoute(route: string, book: Book, success : any)
	{
		$.ajax({
            url: route,
            type: "POST",
            data: ko.toJSON(book),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
			success: success
		});
	}

	private showSuccess()
	{
		if(confirm("Save completed, do you want to return to the overview"))
		{
			this.backToOverview();
		}
	}

	private scrollToTop()
	{
		window.scrollTo(0,0);
	}


	
}

ko.applyBindings(new BookCollectionViewModel());