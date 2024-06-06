class ServiceObject {
    constructor(status = 200, error = null, data = null) {
      this.status = status
      this.error = error
      this.data = data
    }
  }
  

module.exports = ServiceObject;
