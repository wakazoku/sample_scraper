# Register

## ▼概要

[Scraper](../scraper/README.md)で取得した記事をMySQLに登録する。  
構成は Express + MySQL + Sequelize。

## ▼ローカル環境構築

### 1. npm インストールする

カレントディレクトリで依存ライブラリをインストールする。

```node.js
$ npm i
```

### 2. サーバーを起動する

[nodemon](https://github.com/remy/nodemon#nodemon)を使用することでホットリロードに対応。  
下記コマンドでサーバー起動する。

```node.js
$ npx nodemon
```

### 3. localhost にアクセスしてみる

json 型が返ってくれば成功。  
[http://localhost:3000/register](http://localhost:3000/register)
