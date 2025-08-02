import { Document, Query } from "mongoose";

interface IQuery {
  page?: string;
  limit?: string;
  sort?: string;
  fields?: string;
  search?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export class QueryBuilder<T extends Document> {
  private query: Query<T[], T>;
  private filters: IQuery;

  constructor(query: Query<T[], T>, filters: IQuery) {
    this.query = query;
    this.filters = { ...filters };
  }

  filter(): this {
    const exclude = ["page", "limit", "sort", "fields", "search"];
    const filterObj = { ...this.filters };

     for (const field of exclude) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filterObj[field]
        }
    this.query = this.query.find(filterObj);
    return this;
  }

  search(fields: string[] = ["currentStatus", "trackingId", "deliveryFee", "parcelType"]): this {
    const searchTerm = this.filters.search;
    if (searchTerm) {
      this.query = this.query.find({
        $or: fields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      });
    }
    return this;
  }

  sort(): this {
    if (this.filters.sort) {
      const sortBy = this.filters.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  fields(): this {
      const fields = this.filters.fields?.split(",").join(" ") || "";
      this.query = this.query.select(fields);
    
    return this;
  }

  paginate(): this {
    const page = Number(this.filters.page ||1);
    const limit = Number(this.filters.limit || 10);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  build() {
    return this.query;
  }

  async getMeta() {
    const page = Number(this.filters.page || 1);
    const limit = Number(this.filters.limit || 10);

    const total = await this.query.model.countDocuments(this.query.getQuery());
    const totalPages = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      totalPages,
    };
  }
}
