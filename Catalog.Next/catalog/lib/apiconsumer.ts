import { IBookAvailabilityStatusUpdateModel, IBookDetailUpdateModel, IBookReadBadgeUpdateModel, IBookReadStatusUpdateModel } from "./IBook";

/**
 * Typesafe consumer of the API, allowing clients to retrieve from the server
 */
export default class ApiConsumer {
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
        const res = await fetch("/api/" + url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

        if (!res.ok) {
            return null;
        }

        return await res.json();
    }

    private async postRequest(url: string, data: any) : Promise<boolean> {
        const res = await fetch("/api/" + url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return res.ok;
    }
}
