const defaultExclusionsFromResponse = ['__v', 'password'];

class HttpResponse {
  constructor(data, options = { statusCode: 200, deleted: null }) {
    this.statusCode = options.statusCode || 200;
    let filteredData = data;

    // handles JS arrays or objects
    if (typeof filteredData === 'object') {
      filteredData = this.filterData(JSON.parse(JSON.stringify(filteredData)));
    }
    if (options.deleted) {
      this.deleted = options.deleted;
    }
    if (Array.isArray(filteredData)) {
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
          if (key === '_id') {
            data[index]['id'] = data[index][key];
            delete data[index][key];
          }
          if (key === 'calendarSettings' || key === 'calendar' || key === 'roles') {
            data[index][key] = this.filterData(data[index][key]);
          }
        });
      });
    } else if (typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        if (defaultExclusionsFromResponse.includes(key)) {
          delete data[key];
        }
        if (key === '_id') {
          data['id'] = data[key];
          delete data[key];
        }
        if (key === 'calendarSettings' || key === 'calendar' || key === 'roles') {
          data[key] = this.filterData(data[key]);
        }
      });
    }
    return data;
  };
}

export default HttpResponse;
