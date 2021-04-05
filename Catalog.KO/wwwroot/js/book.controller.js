var PropertyCopier = /** @class */ (function () {
    function PropertyCopier() {
    }
    PropertyCopier.CopyElement = function (from, to) {
        //Look for all properties in the input and map them to our own property functions
        for (var property in from) {
            if (to[property] != null) {
                to[property](from[property]);
            }
        }
        return to;
    };
    return PropertyCopier;
}());
var Book = /** @class */ (function () {
    function Book(input) {
        this.author = ko.observable("");
        this.bookID = ko.observable(0);
        this.category = ko.observable("");
        this.description = ko.observable("");
        this.fileName = ko.observable("");
        this.folder = ko.observable("");
        this.identifier = ko.observable("");
        this.language = ko.observable("");
        this.medium = ko.observable("");
        this.readRemark = ko.observable("");
        this.readStatus = ko.observable("");
        this.status = ko.observable("");
        this.statusRemark = ko.observable("");
        this.subject = ko.observable("");
        this.title = ko.observable("");
        this.nrOfPages = ko.observable(null);
        this.isRead = ko.observable(false);
        this.isReading = ko.observable(false);
        this.isToRead = ko.observable(false);
        this.isUnknown = ko.observable(false);
        this.isNotGoingToRead = ko.observable(false);
        if (input != null) {
            this.ReadFromIBook(input);
        }
    }
    Book.prototype.ReadFromIBook = function (input) {
        PropertyCopier.CopyElement(input, this);
        this.isRead = ko.observable(this.readStatus() == "Read");
        this.isToRead = ko.observable(this.readStatus() == "To read");
        this.isReading = ko.observable(this.readStatus() == "Reading");
        this.isNotGoingToRead = ko.observable(this.readStatus() == "Not going to read");
        this.isUnknown = ko.observable(!this.readStatus());
        return this;
    };
    return Book;
}());
var BookCollectionViewModel = /** @class */ (function () {
    function BookCollectionViewModel() {
        var _this = this;
        //TODO: this one should from the server (config??)
        this.RouteRoot = "http://localhost:7071/api/";
        this.RouteGetAll = "Books/All";
        this.RouteGetDetails = "Book/BOOKID/Detail";
        this.RouteUpdateDetails = "Book/BOOKID/UpdateBookData";
        this.RouteUpdateReadStatus = "Book/BOOKID/UpdateReadStatus";
        this.RouteUpdateAvailabilityStatus = "Book/BOOKID/UpdateAvailabilityStatus";
        this.ShowingActiveBook = ko.observable(false);
        this.Collection = ko.observable([]);
        this.ActiveBook = ko.observable(new Book(null));
        this.NumberOfBooks = ko.computed(function () { return _this.Collection().length; }, this);
        var _self = this;
        // Define sammy routes for location/hash navigation
        var sammy = Sammy(function () {
            this.get('/#Detail/:bookid', function () {
                var bookID = this.params.bookid;
                var dummyBook = new Book({ bookID: bookID });
                _self.loadDetails(dummyBook);
            });
            this.get('/#Overview/', function () {
                _self.loadOverview();
            });
            //Root matches to not found, so navigate back to the overview
            this.notFound = function () {
                console.log("Not found: ", this);
            };
        });
        this.loadFromServer(function () { return sammy.run(); }); //When loaded run Sammy script
    }
    BookCollectionViewModel.prototype.loadFromServer = function (onComplete) {
        var _self = this;
        $.getJSON(this.composeRoute(this.RouteGetAll), function (data) {
            //TODO: Check if and how we can use the .mapping from KO here. 
            //Example online states a mapping on the whole viewmodel, while we only want to do a part
            var bookArray = [];
            for (var i = 0; data != null && i < data.length; i++) {
                bookArray.push(new Book().ReadFromIBook(data[i]));
            }
            _self.Collection(bookArray);
            if (onComplete != null) {
                onComplete();
            }
        });
    };
    BookCollectionViewModel.prototype.showDetails = function (data) {
        location.hash = "Detail/" + data.bookID().toString();
    };
    BookCollectionViewModel.prototype.loadDetails = function (data) {
        var _self = this;
        var url = this.prepRouteForBook(this.composeRoute(this.RouteGetDetails), data);
        $.getJSON(url, function (data) {
            _self.ActiveBook(new Book().ReadFromIBook(data));
            _self.ShowingActiveBook(true);
            _self.scrollToTop();
        });
    };
    BookCollectionViewModel.prototype.backToOverview = function () {
        location.hash = "Overview/";
    };
    BookCollectionViewModel.prototype.loadOverview = function () {
        this.ShowingActiveBook(false);
        this.ActiveBook(new Book());
        this.scrollToTop();
        this.loadFromServer(); //TODO: smarter update, now we just reload all
    };
    BookCollectionViewModel.prototype.updateBookData = function (data) {
        if (confirm("Are you sure you want to update the basic book details?")) {
            var _self = this;
            var route = this.prepRouteForBook(this.composeRoute(this.RouteUpdateDetails), data);
            this.postBookToRoute(route, data, this.showSuccess.bind(this));
        }
    };
    BookCollectionViewModel.prototype.updateReadData = function (data) {
        var _self = this;
        var route = this.prepRouteForBook(this.composeRoute(this.RouteUpdateReadStatus), data);
        this.postBookToRoute(route, data, this.showSuccess.bind(this));
    };
    BookCollectionViewModel.prototype.updateAvailabilityData = function (data) {
        var _self = this;
        var route = this.prepRouteForBook(this.composeRoute(this.RouteUpdateAvailabilityStatus), data);
        this.postBookToRoute(route, data, this.showSuccess.bind(this));
    };
    BookCollectionViewModel.prototype.composeRoute = function (routeSuffix) {
        var r = this.RouteRoot;
        if (r.lastIndexOf("/") != r.length - 1) {
            r += "/";
        }
        ;
        r = r + routeSuffix;
        console.log("Route->" + r);
        return r;
    };
    BookCollectionViewModel.prototype.prepRouteForBook = function (route, data) {
        return route.replace(/BOOKID/g, data.bookID() + "");
    };
    BookCollectionViewModel.prototype.postBookToRoute = function (route, book, success) {
        $.ajax({
            url: route,
            type: "POST",
            data: ko.toJSON(book),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: success
        });
    };
    BookCollectionViewModel.prototype.showSuccess = function () {
        if (confirm("Save completed, do you want to return to the overview")) {
            this.backToOverview();
        }
    };
    BookCollectionViewModel.prototype.scrollToTop = function () {
        window.scrollTo(0, 0);
    };
    return BookCollectionViewModel;
}());
ko.applyBindings(new BookCollectionViewModel());
