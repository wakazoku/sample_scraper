# Register

## ▼概要

[Scraper](../scraper/README.md)で取得した記事をMySQLに登録する。  
構成は Express + MySQL + Sequelize。

## ▼ローカル環境構築

### ●Express

#### 1. npm インストールする
カレントディレクトリで依存ライブラリをインストールする。

```node.js
$ npm i
```

#### 2. サーバーを起動する
[nodemon](https://github.com/remy/nodemon#nodemon)を使用することでホットリロードに対応。  
下記コマンドでサーバー起動する。

```node.js
$ npx nodemon
```

#### 3. 接続テスト
json型が返ってくれば成功。  
[http://localhost:3000/register](http://localhost:3000/register)

### ●MySQL

#### 1. db-dataフォルダを作成
```environment```直下に```db-data```フォルダを作成する

```bash
$ mkdir environment/db-data
```

#### 2. Docker Compsoseを起動
※ご自身のホスト端末上でDocker環境を整えてから実行して下さい。
```bash
$ docker-compose environment/docker-compose.yml --build
```

#### 3. 接続テスト
##### ・Adminerに接続出来るか確認  
[http://0.0.0.0:8080/](http://0.0.0.0:8080/)  
※接続情報は```app/register/environment/docker-compose.yml```を参照のこと


##### ・MySQLに接続出来るか確認
```
$ node sample/dbConnectionTest.js
```

```The solution is:  2```がコンソールに表示されれば接続出来ている。