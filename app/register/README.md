# Register

## ▼ 概要

[Scraper](../scraper/README.md)で取得した記事をMySQLに登録します。  
構成は Express + MySQL + Sequelize。

## ▼ ローカル環境構築

### ●Express

#### 1. npm インストール
カレントディレクトリで依存ライブラリをインストールします。

```node.js
$ npm i
```

#### 2. サーバーを起動
[nodemon](https://github.com/remy/nodemon#nodemon)を使用することでホットリロードに対応。  
下記コマンドでサーバーを起動します。

```node.js
$ npx nodemon
```

#### 3. 接続テスト
json 型が返ってくれば成功。  
[http://localhost:3000/register](http://localhost:3000/register)

### ●MySQL

#### 1. db-data フォルダを作成
`environment`直下に`db-data`フォルダを作成します。

```bash
$ mkdir environment/db-data
```

#### 2. Docker Compsose を起動
ご自身のホスト端末上で Docker 環境を整えてから実行して下さい。

```bash
$ docker-compose -f environment/docker-compose.yml --build
```
※[この記事](https://qiita.com/muff1225/items/48e0753e7b745ec3ecbd)を参考にDockerfile化しました。

#### 3. 接続テスト
##### ・Adminer に接続出来るか確認
[http://0.0.0.0:8080/](http://0.0.0.0:8080/)  
※接続情報は`environment/docker-compose.yml`を参照のこと

##### ・MySQL に接続出来るか確認
```
$ node sample/dbConnectionTest.js
```

`The solution is: 2`がコンソールに表示されれば接続出来てます。

### ●Seaqlize
#### 1. マイグレーション
マイグレーションコマンドを実行し、テーブルを作成します。

```
$ node_modules/.bin/sequelize db:migrate
```

#### 2. シーディング
シードファイルを実行し、初期データを登録します。

```
node_modules/.bin/sequelize db:seed:all
```

#### 3. モデルからデータが取得できるか確認
Usersテーブルの一覧が表示されます。  
[http://localhost:3000/users/test](http://localhost:3000/users/test)  

