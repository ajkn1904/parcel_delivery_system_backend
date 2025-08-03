"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const parcel_constants_1 = require("../modules/parcel/parcel.constants");
class QueryBuilder {
    constructor(query, filters) {
        this.query = query;
        this.filters = Object.assign({}, filters);
    }
    filter() {
        const filterObj = Object.assign({}, this.filters);
        for (const field of parcel_constants_1.excludeField) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filterObj[field];
        }
        this.query = this.query.find(filterObj);
        return this;
    }
    search(searchableFields) {
        const search = this.filters.search || "";
        if (search) {
            this.query = this.query.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: search, $options: "i" },
                })),
            });
        }
        return this;
    }
    sort() {
        if (this.filters.sort) {
            const sortBy = this.filters.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }
    fields() {
        var _a;
        const fields = ((_a = this.filters.fields) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "";
        this.query = this.query.select(fields);
        return this;
    }
    paginate() {
        const page = Number(this.filters.page || 1);
        const limit = Number(this.filters.limit || 10);
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
    build() {
        return this.query;
    }
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(this.filters.page || 1);
            const limit = Number(this.filters.limit || 10);
            const total = yield this.query.model.countDocuments(this.query.getQuery());
            const totalPages = Math.ceil(total / limit);
            return {
                total,
                page,
                limit,
                totalPages,
            };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
