class apiFeature {
  constructor(mongooseQuery, queryString) {
    // mongooseQuery --> model.find(filter)
    // querySting --> req.query

    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    // 1) Filtering
    const queryStringObj = { ...this.queryString };
    const execulds = ["page", "limit", "field", "sort", "Keyword"];
    execulds.forEach((val) => {
      delete queryStringObj[val];
    });

    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.field) {
      const fields = this.queryString.field.split(",").join(" ");

      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  search(Model) {
    if (this.queryString.Keyword) {
      let keywordQuery;

      if (Model === "Product") {
        keywordQuery = {
          $or: [
            {
              title: { $regex: this.queryString.Keyword, $options: "i" },
            },
            {
              description: { $regex: this.queryString.Keyword, $options: "i" },
            },
          ],
        };
      } else {
        keywordQuery = {
          name: { $regex: this.queryString.Keyword, $options: "i" },
        };
      }

      this.mongooseQuery = this.mongooseQuery.find(keywordQuery);
    }
    return this;
  }

  paginate(countDocument) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit; // 1*5 2*5

    // Pagination result
    const pagination = {};

    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocument / limit);

    // previousPage
    if (skip > 0) {
      pagination.previousPage = page - 1;
    }

    // nextPage
    if (endIndex < countDocument) {
      pagination.nextPage = page + 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.pagination = pagination;
    return this;
  }
}
module.exports = apiFeature;
