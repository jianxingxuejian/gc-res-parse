<h1 align="center">gc-res-parse</h1>

[English](README.md) | 简体中文

一个简单的数据解析脚本，为我的[另一个项目](https://github.com/jianxingxuejian/grasscutter-tools)提取和解析相应的json数据。

数据来源是[这个项目](https://github.com/tamilpp25/Grasscutter_Resources)。

## Usage

```shell
// 你也可以用npm或者yarn。
pnpm install

// 确认res文件夹与这个项目在同一级。你可以选择解析全部或者其中一至多项。
pnpm parse all 
pnpm parse avatar
pnpm parse quest scene monster...
```

默认情况下数据会提取到 /dist/new 文件夹下。

你可以把旧版本的数据放在/dist/old文件夹中，然后会生成差异数据（新减旧）和合并数据（旧+新）。

