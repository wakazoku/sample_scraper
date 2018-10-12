const puppeteer = require("puppeteer");
const fs = require("fs");
const csv = require("csv");
const iconv = require("iconv-lite");
const moment = require("moment");
const axios = require('axios');

(async () => {
    // キャッチされない例外の処理
    process.on("uncaughtException", err => {
        console.dir(err);
        process.exit(1);
    });

    // Promiseが正しくハンドリングされていない場合の処理
    process.on("unhandledRejection", reason => {
        console.dir(reason);
        process.exit(1);
    });

    // プロセス終了時の処理
    process.on("exit", code => {
        console.log(`exit: ${code}`);
    });

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--lang=ja,en-US,en','--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(180000); // 不安定なのでたっぷり3分間タイムアウトを待つ

    // スクレイピング先に遷移
    await page.goto("https://liginc.co.jp/blog/", {
        waitUntil: "networkidle2"
    });
    await page.waitFor(1000);

    let output = [];
    try {
        await scrapeTopListPage(page, output);
        await scrapeListPage(page, output);
    } catch (e) {
        conso.error("エラー発生ページ: " + await page.url())
        console.error(e);
    } finally {
        // csv出力する
        exportCsvFile(output, await page.url());

        // ブラウザを終了する
        await browser.close();
    }
})();

// トップページの記事を取得する
async function scrapeTopListPage(page, output) {
    console.log(`scrapeTopListPage`);
    console.log(await page.url()); // スクレイピングURLを出力
    // TOPページで最新記事を取得
    if (await hasArticleCombined(page)) {
        console.log("TOPページで最新記事を取得");
        for (
            let articleCombinedNum = 1; articleCombinedNum <= 2; articleCombinedNum++
        ) {
            // TODO: 何度も登場するのでarticleクラスを作る？
            let article = {
                title: null,
                url: null,
                postDate: null,
                author: null,
                categories: null,
                ligLikeCount: null,
                fbLikeCount: null,
                tweetCount: null,
                hatenaBCount: null
            };

            // like数カウント
            article.ligLikeCount = await page.$eval(
                `div.articlecombined > article:nth-child(${articleCombinedNum}) > a > div.articlecombined-content > div > div.like > span.like-counter`,
                el => el.innerText
            );

            // 1秒待って記事をクリック
            await page.waitFor(1000);
            await Promise.all([
                page.waitForNavigation({
                    waitUntil: "domcontentloaded"
                }),
                page.click(
                    `div.articlecombined > article:nth-child(${articleCombinedNum}) > a > div.articlecombined-content > h2`
                )
            ]);

            // 詳細ページを解析する
            await scrapeDetailPage(page, article);
            output.push(article);

            // TOPページに戻る
            await page.goBack(1000);
        }
    }

    let articleListIndex = 1; // 記事の位置を保存
    let laterFlg = false; // 前半後半を判定
    console.log("TOPページの他の記事を取得");
    while (1) {
        let existArtcile = null;
        let existArtcilePath = null;
        let article = {
            title: null,
            url: null,
            postDate: null,
            author: null,
            categories: null,
            ligLikeCount: null,
            fbLikeCount: null,
            tweetCount: null,
            hatenaBCount: null
        };

        // TODO:この辺りのフラグ管理が地獄なのでメソッドに切り分けたい
        // 前半の場合
        if (laterFlg === false) {
            // 記事の位置を取得する
            existArtcilePath = `div.l-content-main.l-content-margin-blogtop > div:nth-child(3) > article:nth-child(${articleListIndex})`;
            existArtcile = await page.$(existArtcilePath);
            console.log("前半の記事を確認するよ");
        }

        // 前半かつ記事が存在する場合
        if (existArtcile && laterFlg === false) {
            // like数カウント
            article.ligLikeCount = await page.$eval(
                `${existArtcilePath} > a > div.articlelist-content > div > div.like > span.like-counter`,
                el => el.innerText
            );
            console.log("前半の記事が存在するよ");
        }

        // 後半の場合
        if (laterFlg === true) {
            // 記事の位置を変更する
            existArtcilePath = `div.l-content-main.l-content-margin-blogtop > div:nth-child(5) > article:nth-child(${articleListIndex})`;
            existArtcile = await page.$(existArtcilePath);
            console.log("後半の記事を確認するよ");
        }

        // 後半かつ記事が存在する場合
        if (existArtcile && laterFlg === true) {
            // like数カウント
            article.ligLikeCount = await page.$eval(
                `${existArtcilePath} > a > div.articlelist-content > div > div.like > span.like-counter`,
                el => el.innerText
            );
            console.log("後半の事が存在するよ");
        }

        // 後半記事まで到達していない場合
        if (!existArtcile && laterFlg === false) {
            console.log("後半記事をこれから読みます");
            articleListIndex = 1;
            laterFlg = true;
            continue;
        }

        // すべての記事を読み切った場合
        if (!existArtcile && laterFlg === true) {
            console.log("このページのすべての記事を読み切ったよ");
            break;
        }

        // 1秒待って記事をクリックする
        await page.waitFor(1000);
        await Promise.all([
            page.waitForNavigation({
                waitUntil: "domcontentloaded"
            }),
            page.click(existArtcilePath)
        ]);

        // 詳細ページを解析する
        await scrapeDetailPage(page, article);
        output.push(article);

        // 一覧ページに戻る
        await page.goBack(1000);
        articleListIndex++;
    }

    // ページを見込みを待って次のページに遷移する
    console.log("ページ遷移します");
    await page.waitFor(1000);
    await Promise.all([
        page.waitForNavigation({
            waitUntil: "domcontentloaded"
        }),
        page.click("div.l-pagenation > div.l-pagenation-more > a")
    ]);
}

// 下層の記事を取得する
async function scrapeListPage(page, output) {
    console.log(`scrapeListPage`);
    let articleListIndex = 1; // 記事の位置を保存
    let laterFlg = false; // 前半後半を判定
    console.log(await page.url()); // スクレイピングURLを出力
    while (1) {
        let article = {
            title: null,
            url: null,
            postDate: null,
            author: null,
            categories: null,
            ligLikeCount: null,
            fbLikeCount: null,
            tweetCount: null,
            hatenaBCount: null
        };

        const existArtcilePath = `div.l-content-main.l-content-main-archive > div.articlelist > article:nth-child(${articleListIndex})`;
        await page.waitFor(1000);
        let existArtcile = await page.$(existArtcilePath);

        if (existArtcile) {
            // like数カウント
            article.ligLikeCount = await page.$eval(
                `${existArtcilePath} > a > div.articlelist-content > div > div.like > span.like-counter`,
                el => el.innerText
            );
        }
        // 前半記事を読み切った場合
        if (!existArtcile && !laterFlg) {
            console.log("前半記事を読みきったよ！これから後半記事を読みます");
            articleListIndex++; // 広告が挟まるのでindexを1つ飛ばす
            laterFlg = true;
            continue;
        }

        // 後半記事を読み切った場合
        if (!existArtcile && laterFlg) {
            console.log("すべての記事を読みました。");
            break;
        }

        // 1秒待って記事をクリックする
        await page.waitFor(1000);
        await Promise.all([
            page.waitForNavigation({
                waitUntil: "domcontentloaded"
            }),
            page.click(existArtcilePath)
        ]);
        console.log(`1秒待って記事をクリックする`);

        // 詳細ページを解析する
        await scrapeDetailPage(page, article);
        output.push(article);

        // 一覧ページに戻る
        await page.goBack(1000);
        articleListIndex++;
    }

    // 次のページを確認する
    let nextLink = await page.$("div.l-pagenation > div.l-pagenation-more > a");
    if (nextLink) {
        console.log("存在する場合、ページに遷移");
        await page.waitFor(1000);
        await Promise.all([
            page.waitForNavigation({
                waitUntil: "domcontentloaded"
            }),
            page.click("div.l-pagenation > div.l-pagenation-more > a")
        ]);
        await scrapeListPage(page, output);
        return;
    }
}

// TOPページの最新記事かどうか確認する
async function hasArticleCombined(page) {
    return (await page.$("div.articlecombined")) ? true : false;
}

// 詳細ページを解析する
async function scrapeDetailPage(page, article) {
    console.log("scrapeDetailPage");
    // ページタイトルを取得
    article.title = await page.title();

    // urlを取得
    article.url = await page.url();

    // 投稿日を取得
    await page.waitForSelector(`div.single-header-content-date`, {
        visible: true
    });
    article.postDate = await page.$eval(
        `div.single-header-content-date`,
        el => el.innerText
    );

    // 投稿者を取得
    await page.waitForSelector(`span.author-name`, {
        visible: true
    });
    article.author = await page.$eval(`span.author-name`, el => el.innerText);

    let categories = null;
    // カテゴリが存在しないことも稀にある
    if (await page.$("div.single-header-content-labels")) {
        categories = await page.$eval(
            // カテゴリを取得
            `div.single-header-content-labels`,
            el => el.innerText
        );
        // 改行コードをセミコロンに置き換える
        article.categories = categories.replace(/\n/g, ";");
    }

    // いいね数を取得
    article.fbLikeCount = await getFacebookGoodNum(page);

    // ツイート数を取得
    article.tweetCount = await getTwitterFavNum(page);

    // ブックマーク数を取得
    article.hatenaBCount = await getBookmarkNum(page);

    console.log(article);
    return;
}

// Facebookのいいね数を取得する
async function getFacebookGoodNum(page) {
    await page.waitFor(1000);

    // facebookのshareボタンのIframeのsrc属性を取得
    await page.waitForSelector(
        "div.single-footer-share.single-footer-share-margin > ul > li:nth-child(2) > div > span > iframe", {
            visible: true
        }
    );
    const facebookIframeURL = await page.$eval(
        `div.single-footer-share.single-footer-share-margin > ul > li:nth-child(2) > div > span > iframe`,
        el => el.src
    );

    // iframeを開く
    await page.goto(facebookIframeURL, {
        waitUntil: "networkidle2"
    });

    // いいね数を取得
    await page.waitForSelector(`span#u_0_1`, {
        visible: true
    });
    const goodNum = await page.$eval(`span#u_0_1`, el => el.innerText);

    // 記事に戻る
    await page.goBack(1000);

    return goodNum;
}

// Twitterのツイート数を取得する
async function getTwitterFavNum(page) {
    await page.waitFor(1000);
    // twitterのshareボタンのIframeのsrc属性を取得
    await page.waitForSelector(
        `li.single-footer-share-item.single-footer-share-item-twitter > iframe`, {
            visible: true
        }
    );
    const twitterIframeURL = await page.$eval(
        `li.single-footer-share-item.single-footer-share-item-twitter > iframe`,
        el => el.src
    );

    // iframeを開く
    await page.goto(twitterIframeURL, {
        waitUntil: "networkidle2"
    });

    // つぶやき数を取得
    await page.waitForSelector(`a#count`, {
        visible: true
    });
    const favNum = await page.$eval(`a#count`, el => el.innerText);

    // 記事に戻る
    await page.goBack(1000);

    return favNum;
}

// はてなブックマークのブックマーク数を取得する
async function getBookmarkNum(page) {
    await page.waitFor(1000);
    // 記事のURLを取得する
    const articleUrl = await page.url();

    try {
        // はてなブックマーク件数取得APIを呼び出す
        // http://developer.hatena.ne.jp/ja/documents/bookmark/apis/getcount
        const res = await axios.get(`http://api.b.st-hatena.com/entry.total_count?url=${articleUrl}`);
        return res.data.total_bookmarks;
    } catch (error) {
        console.error(error);
        return -1
    }
}

// CSVファイルを出力する
function exportCsvFile(input, title) {
    // ヘッダーを設定
    const columns = {
        title: "タイトル",
        url: "URL",
        postDate: "投稿日",
        author: "筆者",
        categories: "カテゴリー",
        ligLikeCount: "Ligいいね数",
        fbLikeCount: "Facebookいいね数",
        tweetCount: "ツイート数",
        hatenaBCount: "はてなブックマーク数"
    };

    // shift-jisでcsvに出力
    csv.stringify(
        input, {
            header: true,
            columns: columns
        },
        function (err, output) {
            buf = iconv.encode(output, "shift-jis");
            let now = moment().format('YYYY-MM-DD HH:mm');
            // title = title.replace(/\//g, '_');
            fs.writeFileSync(`${now}_${title}_output.csv`, buf);
        }
    );
    console.log("取得した記事をcsv出力しました");
}
