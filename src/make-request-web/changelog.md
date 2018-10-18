#1.10.0

* Se integra la librería de Firebase como nueva API (solo storage):

#1.9.0

* Se agrega ***silent*** como opción en el make-request. No registra en el reducer el inicio y final de la llamada.  
* Se agrega ***customRequestType*** como opción para loadings separados del general.
* Mock response. Se añade la opción de mockear la respuesta de servicio a través de la opción ***mockResponse***
* Nuevos HOCS:
    * withMakeRequestProps
    * withServiceIsLoading
    * withSpinner
    * withCustomRequestSpinner
* Nuevos componentes:
    * ErrorMessage
    * LoadingButton

#TODO

Revisar y añadir historial de cambios de versiones anteriores