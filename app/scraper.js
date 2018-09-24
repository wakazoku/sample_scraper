const puppeteer = require('puppeteer');
const fs = require('fs');
// const csv = require('csv/lib');
const Encoding = require('../node_modules/encoding-japanese');

(async () => {
    // キャッチされない例外の処理
    process.on('uncaughtException', err => {
        console.dir(err)
        process.exit(1)
    })

    // Promiseが正しくハンドリングされていない場合の処理
    process.on('unhandledRejection', reason => {
        console.dir(reason)
        process.exit(1)
    })

    // プロセス終了時の処理
    process.on('exit', code => {
        console.log(`exit: ${code}`)
    })


    const browser = await puppeteer.launch({
        headless: false,
        args: ['--lang=ja,en-US,en']
    });
    const page = await browser.newPage();

    // Ligのページに飛ぶ
    await page.goto('https://liginc.co.jp/blog/', 'domcontentloaded')
    await page.waitFor(1000)

    let output = []
    await scrapeTopListPage(page, output)
    // await scrapeListPage(page, output)

    // ブラウザを終了する
    // console.log(output)
    exportCsvFile(output)
    await browser.close();

})();

async function scrapeTopListPage(page, output) {
    console.log(`scrapeTopListPage`)
    // TOPページで最新記事を取得
    if (await hasArticleCombined(page)) {
        console.log('TOPページで最新記事を取得')
        for (let articleCombinedNum = 1; articleCombinedNum <= 2; articleCombinedNum++) {

            let article = []

            // like数カウント
            article.push(await page.$eval(
                `div.articlecombined > article:nth-child(${articleCombinedNum}) > a > div.articlecombined-content > div > div.like > span.like-counter`,
                el => el.innerText
            ))

            // 1秒待つ
            await page.waitFor(1000)

            // 詳細ページに遷移
            await Promise.all([
                // 記事をクリック
                page.click(
                    `div.articlecombined > article:nth-child(${articleCombinedNum}) > a > div.articlecombined-content > h2`
                ),
                // ページを見込みを待つ
                page.waitForNavigation()
            ])

            // 詳細ページを解析する
            article.push(await scrapeDetailPage(page, article))
            output.push(article)

            // TOPページに戻る
            await page.goBack(1000)
        }
    }

    let articleListIndex = 1
    let laterFlg = false
    console.log('TOPページで記事を取得')
    while (1) {
        let article = []
        let existArtcile = null

        // 前半の場合
        if (laterFlg === false) {
            existArtcile = await page.$(
                `div.l-content-main.l-content-margin-blogtop > div:nth-child(3) > article:nth-child(${articleListIndex})`
            )
        }

        // 前半かつ記事が存在する場合
        if (existArtcile && laterFlg === false) {
            // like数カウント
            article.push(await page.$eval(
                `div.l-content-main.l-content-margin-blogtop > div:nth-child(3) > article:nth-child(${articleListIndex}) > a > div.articlelist-content > div > div.like > span.like-counter`,
                el => el.innerText
            ))
        }

        // 後半の場合
        if (laterFlg === true) {
            existArtcile = await page.$(
                `div.l-content-main.l-content-margin-blogtop > div:nth-child(5) > article:nth-child(${articleListIndex})`
            )
        }

        // 後半かつ記事が存在する場合
        if (existArtcile && laterFlg === true) {
            // like数カウント
            article.push(await page.$eval(
                `div.l-content-main.l-content-margin-blogtop > div:nth-child(5) > article:nth-child(${articleListIndex}) > a > div.articlelist-content > div > div.like > span.like-counter`,
                el => el.innerText
            ))
        }

        // 後半記事まで到達していない場合
        if (!existArtcile && laterFlg === false) {
            console.log('後半記事をこれから読みます')
            articleListIndex = 1
            laterFlg = true
            continue
        }

        // すべての記事を読み切った場合
        if (!existArtcile && laterFlg === true) {
            console.log("このページのすべての記事を読み切ったよ")
            break
        }

        // 1秒待つ
        await page.waitFor(1000)

        await Promise.all([
            existArtcile.click(),
            // ページを見込みを待つ
            page.waitForNavigation()
        ])

        // 詳細ページを解析する
        article.push(await scrapeDetailPage(page, article))
        output.push(article)

        // 一覧ページに戻る
        await page.goBack(1000)
        articleListIndex++
    }

    // 次のページに遷移する
    return
    // await Promise.all([
    //     page.click('div.l-pagenation > div.l-pagenation-more > a'),
    //     page.waitForNavigation()
    // ])

}


// TODO: トップページと下層ページの構造が違い過ぎるのでメソッドを分けたほうがいい
async function scrapeListPage(page, output) {
    console.log(`scrapeListPage`)
    let articleListIndex = 1
    let laterFlg = false
    while (1) {
        let article = []

        let existArtcile = await page.$(`div.l-content-main.l-content-main-archive > div.articlelist > article:nth-child(${articleListIndex})`)

        if (existArtcile) {
            // like数カウント
            article.push(await page.$eval(
                `div.articlelist > article:nth-child(${articleListIndex}) > a > div.articlelist-content > div > div.like > span.like-counter`,
                el => el.innerText
            ))
        }

        // 後半記事まで到達していない場合
        if (!existArtcile && !laterFlg) {
            console.log('後半記事まで到達していない場合')
            articleListIndex++
            laterFlg = true
            continue
        }

        // すべての記事を読み切った場合
        if (!existArtcile && laterFlg) {
            console.log("すべての記事を読み切ったよ")
            break
        }

        // 1秒待つ
        await page.waitFor(1000)

        await Promise.all([
            existArtcile.click(),
            // ページを見込みを待つ
            page.waitForNavigation()
        ])

        // 詳細ページを解析する
        article.push(await scrapeDetailPage(page, article))
        output.push(article)

        // 一覧ページに戻る
        await page.goBack(1000)
        articleListIndex++
    }

    // 次のページを確認する
    let nextLink = await page.$('div.l-pagenation > div.l-pagenation-more > a')
    if (nextLink) {
        console.log('存在する場合、ページに遷移')
        // 存在する場合、ページに遷移
        await Promise.all([
            nextLink.click(),
            page.waitForNavigation()
        ])
        await scrapeListPage(page, output)
        return
    }

}

async function hasArticleCombined(page) {
    return await page.$('div.articlecombined') ? true : false
}

async function scrapeDetailPage(page, article) {

    // ページタイトルを取得
    article.push(await page.title())

    // urlを取得
    article.push(await page.url())

    // 投稿日を取得
    article.push(await page.$eval(
        `div.single-header-content-date`,
        el => el.innerText
    ))

    // 投稿者を取得
    article.push(await page.$eval(
        `span.author-name`,
        el => el.innerText
    ))

    // カテゴリを取得
    article.push(await page.$eval(
        `div.single-header-content-labels`,
        el => el.innerText
    ))

    // いいね数を取得
    // article.push(await getFacebookGoodNum(page))

    // ツイート数を取得
    // article.push(await getTwitterFavNum(page))

    // ブックマーク数を取得
    // article.push(await getBookmarkNum(page))

    console.log(article)
    return article

}

async function getFacebookGoodNum(page) {
    // facebookのshareボタンのIframeのsrc属性を取得
    const facebookIframeURL = await page.$eval(
        `div.single-footer-share.single-footer-share-margin > ul > li:nth-child(2) > div > span > iframe`,
        el => el.src
    )

    // iframeを開く
    await Promise.resolve([
        await page.goto(facebookIframeURL),
    ])

    // いいね数を取得
    const goodNum = await page.$eval(
        `span#u_0_1`,
        el => el.innerText
    )

    // 一覧ページに戻る
    await page.goBack(1000)

    return goodNum
}

async function getTwitterFavNum(page) {
    // twitterのshareボタンのIframeのsrc属性を取得
    const twitterIframeURL = await page.$eval(
        `li.single-footer-share-item.single-footer-share-item-twitter > iframe`,
        el => el.src
    )

    // iframeを開く
    await Promise.resolve([
        await page.goto(twitterIframeURL),
    ])

    // つぶやき数を取得
    const favNum = await page.$eval(
        `a#count`,
        el => el.innerText
    )

    // 一覧ページに戻る
    await page.goBack(1000)

    return favNum
}


async function getBookmarkNum(page) {

    // 記事のURLを取得する
    let articleUrl = await page.url()
    articleUrl = articleUrl.replace('https://', '')

    // はてブのブクマページに遷移
    await Promise.resolve(
        await page.goto(`http://b.hatena.ne.jp/entry/s/${articleUrl}`)
    )

    // ブックマーク数を取得
    if (await page.$(`#container > div > div > h2`)) {
        await page.goBack(1000)
        return 0
    }

    const bookmarkNum = await page.$eval(
        `span.entry-info-users > a > span`,
        el => el.innerText
    )

    // 記事に戻る
    await page.goBack(1000)

    return bookmarkNum
}

function exportCsvFile(output) {
    // 文字列をShift_JISに変換する
    const sjisBytes = Encoding.convert(output, {
        from: 'UNICODE',
        to: 'SJIS',
        type: 'arraybuffer',
    });

    // ファイルに書き込む
    fs.writeFileSync(output.csv, Buffer.from(sjisBytes))
}