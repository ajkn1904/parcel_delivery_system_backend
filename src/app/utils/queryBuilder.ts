import { Query } from "mongoose";
import { excludeField } from "../modules/parcel/parcel.constants";

export class QueryBuilder<T> {
  private query: Query<T[], T>;
  private filters: Record<string, string>;

  constructor(query: Query<T[], T>, filters: Record<string, string>) {
    this.query = query;
    this.filters = { ...filters };
  }

  filter(): this {
    const filterObj = { ...this.filters };

    for (const field of excludeField) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filterObj[field];
    }
    this.query = this.query.find(filterObj);
    return this;
  }

  search(searchableFields: string[]): this {
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
    const page = Number(this.filters.page || 1);
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
