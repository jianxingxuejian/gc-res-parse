<h1 align="center">gc-res-parse</h1>

English | [简体中文](README_zh-CN.md)

A simple data parsing script to extract and parse the corresponding json data for [another project](https://github.com/jianxingxuejian/grasscutter-tools) of mine.

The data source is from [this project](https://github.com/tamilpp25/Grasscutter_Resources).

## Usage

```shell
// You can also use npm or yarn.
pnpm install

// Make sure the res folder is on the same level as this project. You can choose all or one or several items.
pnpm parse all 
pnpm parse avatar
pnpm parse quest scene monster...
```

By default the data is extracted to the /dist/new folder.

You can place the old version of the data in the /dist/old folder, then it will generate diff data (new minus old) and merge data (old + new).
