import { IBookAvailabilityStatusUpdateModel, IBookDetailUpdateModel, IBookReadBadgeUpdateModel, IBookReadStatusUpdateModel } from "./IBook";

/**
 * Typesafe consumer of the API, allowing clients to retrieve from the server
 */
export default class ApiConsumer {
    async updateReadStatusBadge(updateModel: IBookReadBadgeUpdateModel) : Promise<boolean> {
        if (!updateModel.BookID) {
            return false;
        }

        return await this.patchRequest(`books/${updateModel.BookID}/read-status`, updateModel);
    }

    async updateReadStatus(updateModel: IBookReadStatusUpdateModel)  : Promise<boolean> {
        if (!updateModel.BookID) {
            return false;
        }

        return await this.patchRequest(`books/${updateModel.BookID}/read-status`, updateModel);
    }

    async updateAvailability(updateModel: IBookAvailabilityStatusUpdateModel)  : Promise<boolean> {
        if (!updateModel.BookID) {
            return false;
        }

        return await this.patchRequest(`books/${updateModel.BookID}/availability`, updateModel);
    }

    async updateDetails(updateModel: IBookDetailUpdateModel)  : Promise<boolean> {
        if (!updateModel.BookID) {
            return false;
        }

        return await this.patchRequest(`books/${updateModel.BookID}`, updateModel);
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

    private async patchRequest(url: string, data: any) : Promise<boolean> {
        const res = await fetch("/api/" + url, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return res.ok;
    }
}
