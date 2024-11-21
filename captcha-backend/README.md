* npm init -y
* npm install typescript --save-dev
* update package.json -
  ```
  {
  "scripts":{
  "start":"tsc && node dist/app.js",
  "dev":"nodemon src/app.ts"
  }
  }
  ```
* npm i express
* npm install @types/express nodemon --save-dev
* npx tsc --init
* configure tsconfig.json file src output dir
* npm run dev
* kuch bhi install karna ho to - npm i --save-dev @types/express @types/uuid
* npx tsc -b to compile
* npx nodemon dist/index
