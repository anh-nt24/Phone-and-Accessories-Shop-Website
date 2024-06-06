const fs = require('fs')
const moment = require('moment')

function readImageFile(filePath) {
    try {
      // Read the image file synchronously (for simplicity)
      const imageData = fs.readFileSync(filePath);
      const imageBuffer = Buffer.from(imageData);
      return imageBuffer;
    } catch (error) {
      console.error('Error reading image file:', error.message);
      return null;
    }
  }

module.exports = {
    User: {
        Gmail: '',
        Password: '',
        FullName: '',
        FirstLogin: true,
        UserName: '',
        Role: 'user',
        Status: 'inactive',
        Avatar: readImageFile('../nodejs-final-project/image/weather.png'),
        SecretCode: ''
    },
    Product: {
        ImportPrice: null,
        ProductName: null,
        BarCode: null,
        Status: null,
        CreationDate: moment().format('DD-MM-YYYY HH:mm:ss'),
        Category: null,
        RetailPrice: null,
        SoldByProduct: 0,
        SoldByOrder: 0
    },
    Customer: {
      Name: null,
      PhoneNumber: null,
      Address: null
    },
    Order: {
      TotalAmount: null,
      AmountOfMoneyGivenByCustomer: null,
      ExcessAmount: null,
      DateOfPurchase: null,
      PhoneNumber: null,
      EmployeeName: null
    }
}