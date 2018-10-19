const fs = require('fs');
const csv = require('csv');
const iconv = require('iconv-lite');


const data = [{
    title: 'titleAAAAA',
    url: 'https://test.co.jp/425278',
    postDate: '2018.10.01',
    author: 'よすけ',
    categories: 'Webサービス',
    ligLikeCount: '23',
    fbLikeCount: '13',
    tweetCount: '10',
    hatenaBCount: '1'
  },
  {
    title: 'titleBBBBB',
    url: 'https://test.co.jp/417558',
    postDate: '2018.09.29',
    author: 'さささん',
    categories: 'Web制作\nディレクション\nWebサービス',
    ligLikeCount: '43',
    fbLikeCount: '19',
    tweetCount: '15',
    hatenaBCount: '9'
  },
  {
    title: 'titleCCCCC',
    url: 'https://test.co.jp/426344',
    postDate: '2018.09.28',
    author: 'あきと',
    categories: '人事戦略\n採用情報',
    ligLikeCount: '249',
    fbLikeCount: '234',
    tweetCount: '10',
    hatenaBCount: '5'
  },
  {
    title: 'titleDDDD',
    url: 'https://test.co.jp/421745',
    postDate: '2018.09.28',
    author: '天',
    categories: 'Webクリエイタースクール\n教育',
    ligLikeCount: '8',
    fbLikeCount: '0',
    tweetCount: '6',
    hatenaBCount: '2'
  },
  {
    title: 'titleEEEEE',
    url: 'https://test.co.jp/425962',
    postDate: '2018.09.28',
    author: 'LIGブログ編集部',
    categories: 'エンタメ\n動画',
    ligLikeCount: '7',
    fbLikeCount: '0',
    tweetCount: '6',
    hatenaBCount: '1'
  },
  {
    title: 'titleFFFFFF',
    url: 'https://test.co.jp/419890',
    postDate: '2018.09.28',
    author: 'YEN',
    categories: 'コンテンツ制作\n経営',
    ligLikeCount: '11',
    fbLikeCount: '4',
    tweetCount: '6',
    hatenaBCount: '1'
  },
  {
    title: 'titleGGGGG',
    url: 'https://test.co.jp/424851',
    postDate: '2018.09.28',
    author: '岡田 ダダ',
    categories: 'Webクリエイタースクール\nキャリア\n教育',
    ligLikeCount: '12',
    fbLikeCount: '0',
    tweetCount: '9',
    hatenaBCount: '3'
  }
];

// exportCsvFile(data);
test(data)

function exportCsvFile(input) {
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

  csv.stringify(input, {
    header: true,
    columns: columns
  }, function (err, output) {
    fs.writeFileSync(output);
  });
  console.log("csvを出力しました。");
}

function test(input) {
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
  csv.stringify(input, {
    header: true,
    columns: columns
  }, function (err, output) {
    buf = iconv.encode(output, 'shift-jis');
    fs.writeFileSync('test.csv', buf);
  });
}