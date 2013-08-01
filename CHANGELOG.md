# Version 0.0.4
* App will now set services asynchronously
* App will also emit events `service.SERVICE_NAME` and `remove.SERVICE_NAME`
* [coveralls.io](http://coveralls.io/) support

# Version 0.0.3
* Added `app.lib()` method, to require shared libraries within the scope of the app

# Version 0.0.2
* Added `app.require()` method, which will allow to require things within the scope of a service
* Added `app.remove()` method, to detach services from the app
* Added `config.size()` method, to determine the size of a config storage
* Config class will now emit the `change` event when a `set()` call is made
* JSCoverage support - 100% coverage

# Version 0.0.1
* Initial version
