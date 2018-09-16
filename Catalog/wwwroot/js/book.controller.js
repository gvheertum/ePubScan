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
        this.ReadFromIBook(input);
    }
    Book.prototype.ReadFromIBook = function (input) {
        //Look for all properties in the input and map them to our own property functions
        for (var property in input) {
            if (this[property] != null) {
                this[property](input[property]);
            }
        }
        return this;
    };
    return Book;
}());
var BookCollectionViewModel = /** @class */ (function () {
    function BookCollectionViewModel() {
        var _this = this;
        this.ShowingActiveBook = ko.observable(false);
        this.Collection = ko.observable([]);
        this.ActiveBook = ko.observable(new Book(null));
        this.NumberOfBooks = ko.computed(function () { return _this.Collection().length; }, this);
        this.loadFromServer();
    }
    BookCollectionViewModel.prototype.loadFromServer = function () {
        var _self = this;
        $.getJSON("/api/books/all/", function (data) {
            //TODO: Check if and how we can use the .mapping from KO here. 
            //Example online states a mapping on the whole viewmodel, while we only want to do a part
            var bookArray = [];
            for (var i = 0; i < data.length; i++) {
                bookArray.push(new Book().ReadFromIBook(data[i]));
            }
            _self.Collection(bookArray);
        });
    };
    BookCollectionViewModel.prototype.showDetails = function (data) {
        this.ShowingActiveBook(true);
        this.ActiveBook(data);
    };
    BookCollectionViewModel.prototype.backToOverview = function () {
        this.ShowingActiveBook(false);
        this.ActiveBook(new Book());
    };
    return BookCollectionViewModel;
}());
ko.applyBindings(new BookCollectionViewModel());
//# sourceMappingURL=book.controller.js.map