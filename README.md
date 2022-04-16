

# 部署前端环境

```
npm install -g create-react-app 
create-react-app block-developer-bootcamp
cd block-developer-bootcamp
npm start
```

- 部署truffle 

```
truffle init 
```

- 配置truffle-config.js

在truffle-config.js 自动引入，

```

require('babel-register');
require('babel-polyfill');
require('dotenv').config();
```

修改contract的目录

```
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
```


