const defaultExclusionsFromResponse = ['__v', 'password'];

class HttpResponse {
  constructor(data, options = { statusCode: 200, deleted: null }) {
    this.statusCode = options.statusCode || 200;
    let filteredData = data;

    if (typeof filteredData === 'object') {
      filteredData = this.filterData(JSON.parse(JSON.stringify(filteredData)));
    }
    if (options.deleted) {
      this.deleted = options.deleted;
    }
    if (Array.isArray(filteredData)) {
      filteredData = this.filterData(JSON.parse(JSON.stringify(filteredData)));

      this.data = [...filteredData];
    } else if (typeof filteredData === 'object') {
      this.data = { ...filteredData };
    } else {
      this.data = data;
    }
  }

  filterData = (data) => {
    if (Array.isArray(data)) {
      data.map((x, index) => {
        Object.keys(x).forEach((key) => {
          if (defaultExclusionsFromResponse.includes(key)) {
            delete data[index][key];
          }
        });
      });
    } else if (typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        if (defaultExclusionsFromResponse.includes(key)) {
          delete data[key];
        }
      });
    }
    return data;
  };
}

export default HttpResponse;
