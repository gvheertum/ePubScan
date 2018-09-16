var BookCollectionViewModel = /** @class */ (function () {
    function BookCollectionViewModel() {
        this.Collection = ko.observable([]);
        this.loadFromServer();
    }
    BookCollectionViewModel.prototype.loadFromServer = function () {
        var _self = this;
        $.getJSON("/api/books/all/", function (data) {
            //TODO: Check if and how we can use the .mapping from KO here. 
            //Example online states a mapping on the whole viewmodel, while we only want to do a part
            var bookArray = [];
            for (var i = 0; i < data.length; i++) {
                bookArray.push(new Book(data[i]));
            }
            _self.Collection(bookArray);
        });
    };
    return BookCollectionViewModel;
}());
ko.applyBindings(new BookCollectionViewModel());
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
        if (input != null) {
            //Look for all properties in the input and map them to our own property functions
            for (var property in input) {
                if (this[property] != null) {
                    this[property](input[property]);
                }
            }
        }
    }
    return Book;
}());
//# sourceMappingURL=book.controller.js.map