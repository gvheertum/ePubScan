var BookCollection = /** @class */ (function () {
    function BookCollection() {
    }
    BookCollection.prototype.LoadFromServer = function () {
        $.getJSON("/api/books/all/", function (data) {
            // Now use this data to update your view models, 
            // and Knockout will update your UI automatically 
			console.log(data.length);
			console.log(data);
        });
    };
    return BookCollection;
}());
//# sourceMappingURL=book.controller.js.map