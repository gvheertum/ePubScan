import { IBook, IBookAvailabilityStatusUpdateModel, IBookDetailUpdateModel, IBookReadBadgeUpdateModel, IBookReadStatusUpdateModel } from "./IBook";

/**
 * Typesafe consumer of the API, allowing clients to retrieve from the server
 */
export default class ApiConsumer {
    async getAllBooks() : Promise<IBook[] | null> {
        console.log("getting all books!");
        var data = await this.getRequest<IBook[]>('books/all');
        return data;
    }

    async updateReadStatusBadge(updateModel: IBookReadBadgeUpdateModel) : Promise<boolean> {
        return await this.postRequest('book/readstatusbadge', updateModel);
    }

    async updateReadStatus(updateModel: IBookReadStatusUpdateModel)  : Promise<boolean> {
        return await this.postRequest('book/readstatus', updateModel);
    }

    async updateAvailability(updateModel: IBookAvailabilityStatusUpdateModel)  : Promise<boolean> {
        return await this.postRequest('book/availability', updateModel);
    }

    async updateDetails(updateModel: IBookDetailUpdateModel)  : Promise<boolean> {
        return await this.postRequest('book/details', updateModel);
    }

    private async getRequest<T>(url: string) : Promise<T | null> {
        var data : T | null = null;
        await fetch("/api/" + url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        }).then(async (res) => {
            if (res.status === 200) {
                console.log("call success!");
                data = await res.json();
            } else {
                data = null;
            }
        });
        return data;
    }

    private async postRequest(url: string, data: any) : Promise<boolean> {
        var state : boolean = false;
        await fetch("/api/" + url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(async (res) => {
            var resjson: any = await res.json(); //TODO: give also
            if (res.status === 200) {
                state = true; 
            } else {
                console.log("Broken!");
                state = false;
            }
        });
        return state;
    }
}