import Api from '../common/Api';

export default class ApiMobile extends Api {
    constructor(baseUrl, {timeout = 30000, headers = {}, lang = 'en', errorInterceptor}) {
        super(baseUrl, {
            timeout: timeout,
            headers: headers,
            lang: lang,
            errorInterceptor: errorInterceptor
        })
    }
}
