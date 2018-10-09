const axios = require('axios');

async function getBookmarkTotalNum(url) {
  try {
    const res = await axios.get(`http://api.b.st-hatena.com/entry.total_count?url=${url}`);
    return res.data.total_bookmarks;
  } catch (error) {
    console.error(error);
  }
}


// await関数はasync関数内じゃないと使えないよ
(async () => {
  console.log(
    await getBookmarkTotalNum(`http://delete-all.hatenablog.com/entry/2018/10/04/190000`)
  );
})();