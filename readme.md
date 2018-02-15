#Yuniku Make Request

##Install & config

1. npm install @yuniku/make-request --save
1. Add to your app reducer:

```javascript
import { reducer as serviceReducer, constants as serviceConstants } from '@yuniku/make-request'

export default {
    //other reducers
    [serviceConstants.NAME]: serviceReducer,
};
```

3. Create an instance for your API:
```javascript
import {Api} from '@yuniku/make-request';

const apiBaseUrl = 'http://localhost:8080/api';
const loginHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic YtAwbHaW4516WRZjDBm',
};
const apiHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': "*"
};

export const loginService = new Api(apiBaseUrl, {timeout: 30000, headers: loginHeaders});
export const apiService = new Api(apiBaseUrl, {timeout: 30000, headers: apiHeaders});
```

##Usage

###API Class

| Parameters    | Type          | Default | Default |
| :-----------: |:-------------:| :-----:| -----:|
| url           | string        | -      |


###Make request
###Spinner
###Success Message

