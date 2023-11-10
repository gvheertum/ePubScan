import { IBookAvailabilityStatusUpdateModel, IBookDetailUpdateModel, IBookReadBadgeUpdateModel, IBookReadStatusUpdateModel } from "./IBook";

/**
 * Typesafe consumer of the API, allowing clients to retrieve from the server
 */
export default class ApiConsumer {

    async updateReadStatusBadge(updateModel: IBookReadBadgeUpdateModel) : Promise<boolean> {
        return await this.postRequest('readstatusbadge', updateModel);
    }

    async updateReadStatus(updateModel: IBookReadStatusUpdateModel)  : Promise<boolean> {
        return await this.postRequest('readstatus', updateModel);
    }

    async updateAvailability(updateModel: IBookAvailabilityStatusUpdateModel)  : Promise<boolean> {
        return await this.postRequest('availability', updateModel);
    }

    async updateDetails(updateModel: IBookDetailUpdateModel)  : Promise<boolean> {
        return await this.postRequest('details', updateModel);
    }

    private async postRequest(url: string, data: any) : Promise<boolean> {
        var state : boolean = false;
        await fetch("/api/book/" + url, {
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