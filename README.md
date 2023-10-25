## Overview
This CLI is the official scaffolding generator for [hermes-io](https://www.npmjs.com/package/hermes-io#get-started) generates a simple folder structure that guaranty separation of concerns encompassing pivotal elements such as contexts, hooks and observers.

## Installation
```
npm install hermes-io-cli -g
```

## Usage

This CLI has a set of commands for generate folders and files  for hermes-io entities 

###  Generate: context
By passing the **context** argument a newly created folder named as '**contexts**' is automatically generated. Within this folder, a brand-new [Context](https://github.com/Maxtermax/hermes-io#context) file is generated, adopting the provided value as its designated name.
```
hermes-io-cli --context="MyContext"
```
result:
```
/contexts/MyContext.js
```
```javascript
import { Context } from 'hermes-io';
export const MyContext = new Context('MyContext'); 
```

###  Generate: observer
By passing the **observer** argument a newly created folder named as '**observers**' is automatically generated. Within this folder, a brand-new  [Observer](https://github.com/Maxtermax/hermes-io#observer) file is generated, adopting the provided value as its designated name.
```
hermes-io-cli --observer="MyObserver"
```
result:
```
/observers/MyObserver.js
```
```javascript
import { Observer } from 'hermes-io';
export const MyObserver = new Observer('MyObserver'); 
```
Note: To simplify things you can generate one or more entities by passing the corresponding argument in a single command, for example: 
```
hermes-io-cli --observer="MyObserver" --context="MyContext"
```
result:
```
/contexts/MyContext.js
```
```
/observers/MyObserver.js
```

###  Generate: observer hook

By passing the **hook** argument a newly created folder named as '**hooks**' is automatically generated. Within this folder, a brand-new  [observer hook](https://github.com/Maxtermax/hermes-io#useobserver-hook) file is generated, adopting the provided value as its designated name:
```
hermes-io-cli --hook="useCustom"
```
result:
```
/hooks/useCustom.js
```
```javascript
import { useObserver, Context, Observer } from 'hermes-io';

export const CustomContext = new Context('CustomContext'); 
export const CustomObserver = new Context('CustomObserver'); 

export const UseCustom = () => {
  const handleUseCustomNotification = (payload) => {
    /* handle notification */ 
  };
  useObserver({
    contexts: [CustomContext],
    observer: CustomObserver,
    listener: handleUseCustomNotification,
  });
};
```
Note: Is posible to link existing 

###  Root folder
By default the folders are generated using the current path as base, typically at the root of the project, this can be changes by using the root argument:
```
hermes-io-cli --root="output" --context="MyContext" --observer="MyObserver"
```
result:
```
/output/contexts/MyContext.js
```
```
/output/observers/MyObserver.js
```
