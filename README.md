

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



- truffle 操作

```
truffle compile 
truffle migrate 

```

  - truffle console 控制台操作
    ```
    const token =await Token.deployed()
    undefined
    truffle(development)> token
    truffle(development)> token.address
    '0xeE5178Ae620A299B2a0BDb8e560F9f80f3D5bd54'

    ```  
## 测试 mochajs工具

https://mochajs.org/







