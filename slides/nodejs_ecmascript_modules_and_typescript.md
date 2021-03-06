---
title: Node.js Ecmascript modules in TypeScript
---

# ESM in TypeScript

<img src="./images/node.png" width="700px" /><br>

<small>
Copyright (ÂŠī¸) Euricom
</small>

---

## Intro

As of node 14 the `--experimental-module` is no longer necessary, the esm feature had been marked stable in the node.js [documentation](https://nodejs.org/docs/latest-v14.x/api/esm.html), it was even removed from node v12.17.0.

===

### đ¤ So i thought, while preparing bootcamp:

- Different syntax when working with files and or directories, let us teach the new syntax!
- Cleaner output, no use strict etc. <!-- .element: class="fragment" -->
- It's stable! đ¤Š <!-- .element: class="fragment" -->

đ Nobody said it was ready to combine it with TypeScript đ <!-- .element: class="fragment" -->

---

## Basics

<img src="./images/easy_peasy.jpeg" width="800px" />

===

### Setup

```
# Setup yarn
yarn init

# Add main.ts
mkdir src
touch src/main.ts

# Add TypeScript
yarn add --dev typescript @types/node@14
yarn tsc --init
```

===

#### tsconfig.json

As we are using node.js 14.17.6 which is almost [ES2020 compatible](https://node.green/):

```json
{
  "compilerOptions": {
    "target": "ES2020" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    "module": "commonjs" /* Specify what module code is generated. */,
    "lib": ["ES2020"] /* Specify library files to be included in the compilation. */,
    "moduleResolution": "Node" /* Specify how TypeScript looks up a file from a given module specifier. */,
    "outDir": "./dist" /* Specify an output folder for all emitted files. */,
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. */,
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,
    "strict": true /* Enable all strict type-checking options. */,
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  },
  /* Always specify what to include */
  "include": ["src"]
}
```

===

#### main.ts

```ts
console.log('Hello World!');
```

#### Add rimraf to clean up

```
yarn add --dev rimraf
```

#### package.json

```json
{
  "scripts": {
    "clean": "rimraf dist",
    "build": "tsc"
  }
}
```

===

### Build đ§

```
yarn build
```

##### Output (dist/main.js)

```js
'use strict';
console.log('Hello World!');
```

đ¤ But wait, you are not using any modules?

===

#### Use ecmascript modules

##### src/say.ts

```ts
export function say(message: string): void {
  console.log(message);
}
```

##### src/main.ts

```ts
import { say } from './say';

say('Hello World!');
```

<div class="fragment">

##### dist/main.js

```js
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const say_1 = require('./say');
(0, say_1.say)('Hello World!');
```

By default node uses CommonJS!

</div>

===

### Change it to ESM

Either change the file extension to .mjs (cjs is the default) or use `type: module` in package.json, let choose the latter because đ TypeScript

##### package.json

```json
{
  "type": "module"
}
```

##### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext"
    /* ... */
  }
}
```

===

#### Build, again đ§

##### dist/main.js

```js
import { say } from './say';
say('Hello World!');
```

<small>â¨ Finally, more readable and ESM!</small>

<div class="fragment">

##### đ¤ But what happens when you run it?

```
# đ§¨
â node dist/main.js
internal/process/esm_loader.js:74
    internalBinding('errors').triggerUncaughtException(
                              ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module ...
```

</div>

===

#### Bare Paths

When using ES6 imports in Node.js, you must put the extension .js, except for "bare paths"!

```js
import { say } from './say'; // â
import { say } from './say.js'; // â
```

<div class="fragment">

#### External Modules

```js
import lodash from 'lodash'; // â Bare path
```

```js
import keyBy from 'lodash/keyBy'; // â Not a bare path!
import keyBy from 'lodash/keyBy.js'; // â Not a bare path!
```

</div>

===

#### Build, again and again đ§

##### src/main.js

```ts
import { say } from './say.ts';

say('Hello World!');
```

```
An import path cannot end with a '.ts' extension.
Consider importing './say.js' instead.ts(2691)
```

<div class="fragment">

So even for typescript we have to add .js extension!

<small>

Set `"typescript.preferences.importModuleSpecifierEnding": "js",` in your settings (vscode), so your autoimports adds them by default!

</small>

</div>

<div class="fragment">

đĄ The reasoning behind this is TypeScript's design goal 7: Preserve runtime behavior of all JavaScript code. See [comment](https://github.com/microsoft/TypeScript/issues/15479#issuecomment-543329547)

</div>

---

## nodemon

<img src="./images/no_demon.jpeg" width="500px" />

===

### nodemon

Improving our dev experience seems like a very natural next step

<div class="fragment">

```
yarn add --dev nodemon ts-node
```

##### package.json

```json
{
  "scripts": {
    "start": "nodemon -w src src/main.ts"
  }
}
```

</div>

<div class="fragment">

##### đ§¨ And boom

```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"
 for /Users/tommarien/git/tommarien/2021_talk_node_ts_esm/src/main.ts

at Loader.defaultGetFormat [as _getFormat] (internal/modules/esm/get_format.js:71:15) đ
```

</div>

===

#### This is the moment in life where you start wondering

<div class="fragment">

<img src="./images/blue-pill.jpeg" width="800px" />

Why, oh, why didn't I take the blue pill?

</div>

===

#### The solution?

Although the error complaints about a file extension, esm is really the underlying issue here.

<div class="fragment">

<img src="./images/on-fire.png" width="600px" />

> To solve this we need the experimental [Loader](https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_loaders) API đ.

</div>

===

#### The experimental solution đ§Ē

##### package.json

```json
{
  "scripts": {
    "start": "nodemon -w src --exec node --loader ts-node/esm --no-warnings src/main.ts"
  }
}
```

> `ts-node` comes with a ready to use experimental loader which fixes this exact issue, we pass `--no-warnings` flag to node just because we don't want to be reminded of this abomination!

---

## Jest

<img src="./images/jest.jpeg" width="400px" />

===

### Jest

[Jest](https://jestjs.io/docs/ecmascript-modules) ships with experimental support for ECMAScript Modules (ESM).

```
yarn add --dev jest ts-jest @types/jest
```

##### package.json

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

##### Create jest.config.js

```
yarn ts-jest config:init
```

===

#### Sum

##### src/calc.ts

```ts
export function sum(x: number, y: number): number {
  return x + y;
}
```

##### src/calc.spec.ts

```ts
import { sum } from './calc.js';

test('it adds both numbers', () => {
  expect(sum(1, 4)).toEqual(5);
});
```

<div class="fragment">

##### đ§¨ And boom

```
ReferenceError: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension
and '/Users/tommarien/git/tommarien/2021_talk_node_ts_esm/package.json' contains "type": "module".
To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
    at file:///Users/tommarien/git/tommarien/2021_talk_node_ts_esm/jest.config.js:2:1
```

</div>

===

#### Darn config generator đ¤Ŧ

##### jest.config.js

```js
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

<div class="fragment">

##### đ§¨ And boom

```
$ jest
 FAIL  src/calc.spec.ts
  â Test suite failed to run

    Cannot find module './calc.js' from 'src/calc.spec.ts'

    > 1 | import { sum } from "./calc.js"
        | ^
      2 |
      3 | test('it adds both numbers',()=>{
      4 |    expect(sum(1,4)).toEqual(5);

      at Resolver.resolveModule (node_modules/jest-resolve/build/resolver.js:322:11)
      at Object.<anonymous> (src/calc.spec.ts:1:1)
```

</div>

===

#### Extensions anyone?

<div style="float:left; margin-right:30px">

<img src="./images/extensions.jpeg" width="400px" />

</div>

<div class="fragment">

##### src/calc.spec.ts

Yey, it works when we remove the `.js` đŦ

```ts
import { sum } from './calc';
```

```
$ jest
 PASS  src/calc.spec.ts
  â it adds both numbers (2 ms)
```

</div>

... or so it seems đ <!-- .element: class="fragment" -->

===

#### What about a single convention on extensions?

Atm we have to use Jest's moduleNameMapper, to remove the .js extension ([ts-jest issue 1709](https://github.com/kulshekhar/ts-jest/issues/1709))

```js
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // We need to remove .js ext see https://github.com/kulshekhar/ts-jest/issues/1709
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
```

<div class="fragment">

##### đ And tada

```
$ jest
 PASS  src/calc.spec.ts
  â it adds both numbers (2 ms)
```

</div>

===

#### In depth: `__dirname`, `__filename`

##### CommonJS

```js
// current-file-and-directory.js
console.log({ __dirname, __filename });
```

<div class="fragment">

##### ESM

```js
// â current-file-and-directory.mjs
console.log({ __dirname, __filename }); // đŖ ReferenceError: __dirname is not defined

// â current-file-and-directory.mjs
const filename = import.meta.url;
const dirname = new URL('./', filename).href; // đĄ Resolve relative to the current module

console.log({ dirname, filename });
```

In ESM, your filename and directory will follow WHATWG [URL standard](https://url.spec.whatwg.org/), so they start with `file://`

</div>

===

#### We want proof!

##### src/calc.spec.ts

```ts
import { sum } from './calc.js';

test('it adds both numbers', () => {
  expect(sum(1, 4)).toEqual(5);
  console.log(import.meta.url);
});
```

<div class="fragment">

##### đ§¨ And boom

```
$ jest
 FAIL  src/calc.spec.ts
  â Test suite failed to run

    src/calc.spec.ts:5:15 - error TS1343: The 'import.meta' meta-property is only allowed
     when the '--module' option is 'es2020', 'esnext', or 'system'.

    5   console.log(import.meta.url);
                    ~~~~~~~~~~~
```

</div>

===

#### WHUT đ¤Ŧ

<img src="./images/pain.jpeg" width="700px" />

And i started to feel both đ <!-- .element: class="fragment" -->

===

#### Wir schaffen das!

<img src="./images/bob_the_builder.jpg" width="600px" />

===

#### 1. `--experimental-vm-modules` đ

> --experimental-vm-modules :
> Added in: v9.6.0
>
> Enable experimental ES Module support in the vm module.

```json
/* package.json */
{
  "scripts": {
    /* ... */
    "test": "node --experimental-vm-modules --no-warnings node_modules/.bin/jest"
  }
}
```

===

#### 2. Configure `ts-jest`

```js
// jest.config.js
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  // ...
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
```

<div class="fragment">

##### đ And tada

```
$ node --experimental-vm-modules --no-warnings node_modules/.bin/jest
 PASS  src/calc.spec.ts
  â it adds both numbers (20 ms)

  console.log
    file:///Users/tommarien/git/tommarien/2021_talk_node_ts_esm/src/calc.spec.ts
```

</div>

---

### What about mocking?

<img src="./images/mocking.jpeg" width="500px" />

===

#### total

```ts
// src/calculator.ts
import { sum } from './calc.js';

export function total(...values: number[]): number {
  return values.reduce((previous, current) => sum(previous, current), 0);
}
```

===

#### The test

```ts
import { sum } from './calc.js';
import { total } from './calculator.js';

jest.mock('./calc.js');

test('it sums the given values', () => {
  const mockSum = sum as jest.MockedFunction<typeof sum>);
  mockSum.mockReturnValue(2);

  expect(total(1, 2, 3)).toBe(2);
  expect(mockSum).toHaveBeenCalledTimes(3);
  expect(mockSum).toHaveBeenCalledWith(0, 1);
  expect(mockSum).toHaveBeenCalledWith(2, 2);
  expect(mockSum).toHaveBeenCalledWith(2, 3);
});
```

<div class="fragment">

##### đ§¨ And boom

```
 FAIL  src/calculator.spec.ts
  â Test suite failed to run

    ReferenceError: jest is not defined

      2 | import { total } from './calculator.js';
      3 |
    > 4 | jest.mock('./calc.js');
```

</div>

===

#### The solution ? đĨē

```
yarn add -D @jest/globals
```

```ts
// src/calculator.spec.ts
import { jest } from '@jest/globals';

import { sum } from './calc.js';
import { total } from './calculator.js';

jest.mock('./calc.js');
```

<div class="fragment">

##### đ§¨ And ... boom

```
  â it sums the given values

    TypeError: mockSum.mockReturnValue is not a function

       8 | test('it sums the given values', () => {
       9 |   const mockSum = sum as jest.MockedFunction<typeof sum>;
    > 10 |   mockSum.mockReturnValue(2);
```

</div>

===

#### But why?

<img src="./images/why.gif" width="600px" />

===

#### `jest.mock`

Relies on babel's hoisting tricks đĒ

<div class="fragment" style="margin-top:60px">

#### `ESM`

Native EcmaScript Modules are there before any javascript has a chance to intercept the loading of them. The loader api (experimental) could be a way to circumvent this.

> Luckily work is being done on stabilizing the [loader](https://github.com/nodejs/node/pull/37468) api đ

</div>

===

#### The final solution !!!

```ts
import { test, expect, jest } from '@jest/globals';
import { sum } from './calc.js';

const mockSum = jest.fn<ReturnType<typeof sum>, Parameters<typeof sum>>();

// đ unstable FTW
jest.unstable_mockModule('./calc.ts', () => ({
  sum: mockSum,
}));
```

<div class="fragment">

```ts
// Top level await makes it prettier, but it still ugly
const { total } = await import('./calculator.js');

test('it sums the given values', () => {
  mockSum.mockReturnValue(2);

  expect(total(1, 2, 3)).toBe(2);

  expect(mockSum).toHaveBeenCalledTimes(3);

  expect(mockSum).toHaveBeenCalledWith(0, 1);
  expect(mockSum).toHaveBeenCalledWith(2, 2);
  expect(mockSum).toHaveBeenCalledWith(2, 3);
});
```

</div>

---

### Notable mention

> During bootcamp, it did not try the jest route and abandoned esm for node completely and went back to CJS.

<div class="fragment">

Up until this point the only official mocking library that has complete ESM support is `testdouble.js`, but ... đ

</div>

<div class="fragment">

- it uses quibble underlying, which needs a loader <!-- .element: class="fragment" -->
- typescript needs a loader too <!-- .element: class="fragment" -->
- atm loaders are not composable đ <!-- .element: class="fragment" -->

</div>

---

### The end

<img src="./images/bonkers.jpeg" width="800px" />

<small>https://github.com/tommarien/2021_talk_node_ts_esm</small>
