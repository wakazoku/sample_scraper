# Register

## ▼概要

HeadlessChromeのライブラリ、[Puppeteer](https://github.com/GoogleChrome/puppeteer)を使ったスクレイパー。  
取得した記事は[Register](../register/README.md)を介してDB登録する。

## ▼注意事項
スクレイパーを起動する際は以下の注意点をご自身の目で確認し、スクレイピング対象ページに迷惑をかけないようにしてください。

- 多重起動しないようになっているか
- サイトアクセス時のウェイト時間が1秒以上に設定されているか

当スクレイパーでスクレイピング先に損害を与えた場合の責任は負いかねます。  
  十分にご注意を願います。

## ▼ローカル環境構築

### 1. npm インストールする

カレントディレクトリで依存ライブラリをインストールする。

```node.js
$ npm i
```

### 2. スクレイパーを起動する

```node.js
$ node scraper.js
```

### ▼WIP

- スクレイパーの挙動が不安定
  - 異常終了した場合に規定回数のリトライ機構を持たせる
  - 途中から実行出来るように引数でページ数を指定させる
- コードがスパゲッティになりつつある
  - 処理をメソッドに小出しする
  - クラス化する