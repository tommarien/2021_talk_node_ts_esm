---
title: Node.js Ecmascript modules in TypeScript
---

# ESM in TypeScript

<img src="./images/use-ecmascript-modules-nodejs.jpeg" width="600px" /><br>

<small>
Copyright (©️) Euricom
</small>

---

## Intro

As of node 14 the `--experimental-module` is no longer necessary, the esm feature had been marked stable in the node.js [documentation](https://nodejs.org/docs/latest-v14.x/api/esm.html), it was even removed from node v12.17.0.

<div class="fragment">

##### 🤔 So i thought, while preparing bootcamp:

- Different syntax when working with files and or directories, let us teach the new syntax!
- Cleaner output, no `use strict` etc.
- It's stable!

</div>

🎁 Nobody said it was ready to combine it with TypeScript 🙈 <!-- .element: class="fragment" -->
---

## Basics

<img src="./images/lets-get-it-started.jpeg" width="800px" />

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

### Build 🔧

```
yarn build
```

##### Output (dist/main.js)

```js
'use strict';
console.log('Hello World!');
```

🤔 But wait, `use strict` is not necessary for esm?
