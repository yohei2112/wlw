javascript:

var d = document;

var CAST_LIST_URL = "https://wonderland-wars.net/mycast.html";

var CAST_URL = "https://wonderland-wars.net/castdetail.html?cast=";

//マイキャスト一覧で実行された場合、獲得済みキャスト情報を取得
if (d.URL == CAST_LIST_URL) {

  //各キャストID
  var acqci = [];

  //各キャスト名
  var acqcn = [];


  //タブがファイターの場合
  if (chkrolepage()) {

    //1ページ目の場合
    if (chkpage()) {

      //タブボタンを取得
      var ptbp = d.querySelectorAll('.tab_cast');

      //タブ数を取得
      var tabcnt = ptbp.length;

      //ページボタン保存変数
      var pbp;

      //タブ分回す
      for (var ti = -1; ti < tabcnt; ti++) {

        //初回時以外
        if (ti != -1) {

          //タブボタンを強制的にクリックして移動
          ptbp[ti].click();

          //ページ情報を取得
          d = document;

          //タブボタンを取得
          var ptbp = d.querySelectorAll('.tab_cast');
        }

        //キャストIDを取得
        getCastId();

        //キャスト名を取得
        getCastName();

        //表示していないページを取得
        var pbp = d.querySelectorAll('.page_block_page');

        //2ページ目以降がある場合
        if (pbp.length != 0) {

          var pagecnt = pbp.length;

          for (var i = 0; i < pagecnt; i++) {

            //ページボタンを強制的にクリックして移動
            pbp[i].click();

            //ページ情報を取得
            d = document;

            //キャストIDを取得
            getCastId();

            //キャスト名を取得
            getCastName();

            //表示していないページを取得
            pbp = d.querySelectorAll('.page_block_page');
          }
        }

      }

      //ファイタータブに戻す
      ptbp[0].click();

      var now = new Date().getTime();
      var day = 1000 * 3600 * 24;
      // Cookieの有効期限(365日間)
      var ex = new Date();
      ex.setTime(now + day * 365);

      //キャストIDをcookieに保存
      localStorage.setItem("acqci", escape(acqci.join(":")));

      //キャストIDをcookieに保存
      localStorage.setItem("acqcn", escape(acqcn.join(":")));

      alert("獲得済みキャスト情報取得が完了しました。\n各キャストのページでブックマークレットを実行することで、勝率などを確認できます。\n新たなキャストを獲得した場合は、再度獲得済みキャスト情報取得を行ってください。\n獲得済みキャスト数：" + acqci.length);

    }
  }

  //各キャストのページで実行された場合、勝率などの情報を取得する
} else if (d.URL.indexOf(CAST_URL) >= 0) {

  if (d.getElementById('wlw_custom') == null) {

    // 使用率 ... usage rate
    var ur = [];
    // 勝利数 ... win count
    var wc = [];
    // 総撃破数 ... crush count
    var crc = [];
    // 総撤退数 ... withdraw count
    var wdc = [];

    // キャスト別評価(平均) ... total page
    var tp = [];
    // 勝利時(平均) ... win page
    var wp = [];
    // 敗北時(平均) ... lose page
    var lp = [];

    // 獲得ナイス(平均) ... total nice
    var tn = [];
    // 勝利時(平均) ... win nice
    var wn = [];
    // 敗北時(平均) ... lose nice
    var ln = [];

    // 敗北数 ... lose count
    var lc = [];

    // 勝率 ... win rate
    var wr = [];

    // Kill Ratio ... kill ratio
    var kr = [];

    // キャストID ... cast id
    // 文字数圧縮のため、パラメータはcastを前提とする
    var q = window.location.search.substring(1);
    var ci = q.split("=")[1];
    var pci = "p" + ci;

    //各キャストページからデータを取得する

    //エラーメッセージ
    var err_msg;

    //キャスト画像アドレス
    var castimgurl = [];

    var gameNode = document.createElement("div");

    var CAST_IMG_URL = "common/img_cast/";

    var imgNode_cast = [];

    //現表示中のキャストID
    var dispcastci = ci;

    //実行対象のキャストの配列のindexを保持
    var proc_ci;

    // 全キャスト勝率 ... all win rate
    var awr = 0;
    // 全キャスト勝利数 ... all win count
    var awc = 0;
    // 全キャスト敗北数 ... all lose count
    var alc = 0;
    // 各キャストの勝率 ... cast win rate array
    var cwra = [];
    // 各キャストの勝利数 ... cast win count array
    var cwca = [];
    // 各キャストの敗北数 ... cast lose count array
    var clca = [];

    // 表示する各キャストのID ... display cast id
    var dci = [];
    // 表示する各キャストの名前 ... display cast name
    var dcn = [];

    //cookieからデータを取得
    dci = unescape(localStorage.getItem("acqci")).split(":");
    dcn = unescape(localStorage.getItem("acqcn")).split(":");

    //キャストIDが取得できた場合
    if (dci.length != 0) {

      //エラー番号
      var err_num = 0;

      //表示ページのデータを取得

      //表示ページキャストのキャストID配列上のindexを取得
      proc_ci = dci.indexOf(ci);

      var p1 = d.querySelectorAll('.block_playdata_01_text');
      // 使用率 ... usage rate
      ur[proc_ci] = parseFloat(p1[0].innerHTML);
      // 勝利数 ... win count
      wc[proc_ci] = parseInt(p1[1].innerHTML);
      // 総撃破数 ... crush count
      crc[proc_ci] = parseInt(p1[2].innerHTML);
      // 総撤退数 ... withdraw count
      wdc[proc_ci] = parseInt(p1[3].innerHTML);

      var p2 = d.querySelectorAll('.block_playdata_02_text');
      // キャスト別評価(平均) ... total page
      tp[proc_ci] = parseFloat(p2[0].innerHTML);
      // 勝利時(平均) ... win page
      wp[proc_ci] = parseFloat(p2[1].innerHTML);
      // 敗北時(平均) ... lose page
      lp[proc_ci] = parseFloat(p2[2].innerHTML);

      // 獲得ナイス(平均) ... total nice
      tn[proc_ci] = parseFloat(p2[3].innerHTML);
      // 勝利時(平均) ... win nice
      wn[proc_ci] = parseFloat(p2[4].innerHTML);
      // 敗北時(平均) ... lose nice
      ln[proc_ci] = parseFloat(p2[5].innerHTML);

      // 敗北数 ... lose count
      lc[proc_ci] = 0;
      if ((tp[proc_ci] - lp[proc_ci]) != 0) {
        lc[proc_ci] = parseInt(Math.round((wp[proc_ci] - tp[proc_ci]) * wc[proc_ci] / (tp[proc_ci] - lp[proc_ci])));
      }
      // 勝率 ... win rate
      wr[proc_ci] = 0;
      if ((wc[proc_ci] + lc[proc_ci]) != 0) {
        wr[proc_ci] = Math.round(wc[proc_ci] / (wc[proc_ci] + lc[proc_ci]) * 100 * 10) / 10;
      }
      // Kill Ratio ... kill ratio
      kr[proc_ci] = 0;
      if (wdc[proc_ci] != 0) {
        kr[proc_ci] = Math.round(crc[proc_ci] / wdc[proc_ci] * 100) / 100;
      }

      //キャスト画像アドレスを取得
      var ciusplitstr = d.querySelector('.data_cast_img').innerHTML.split("\"")[1];
      castimgurl[proc_ci] = ciusplitstr.split(CAST_IMG_URL)[1];


      //通信の実行回数
      var exe_cnt = 0;

      //キャストページからデータを取得
      [].forEach.call(dci, (targetCastId, i) => {
        if (i != proc_ci) {
          setTimeout(() => {
            console.log(targetCastId);
            create_request(CAST_URL + targetCastId, i)
          }, i * 1000);
        }
      });
    } else {
      alert("獲得済みキャスト情報が取得できませんでした。\nマイキャスト一覧で獲得済みキャスト情報取得を実行してください。");
    }
  }
} else {
  alert("実行するページが間違っています。\n下記のページで実行してください。\nマイキャスト一覧\n「" + CAST_LIST_URL + "」\n各キャストページ\n「" + CAST_URL + "XX」");
}

//表示処理
function disp_proc() {

  // 初期化
  for (var i = 0; i < dci.length; i++) {
    cwra[dci[i]] = 0;
    cwca[dci[i]] = 0;
    clca[dci[i]] = 0;
  }

  // キャストデータ ... cast data
  // 前回のキャストデータ ... pre cast data
  // 日時情報、使用率、勝利数、敗北数、
  // 勝率、総撃破数、総撤退数、Kill Ratio、
  // キャスト別評価(平均)、勝利時(平均)、敗北時(平均)、
  // 獲得ナイス(平均)、勝利時(平均)、敗北時(平均)
  var now = new Date().getTime();
  var cd = [now, ur[proc_ci], wc[proc_ci], lc[proc_ci],
    wr[proc_ci], crc[proc_ci], wdc[proc_ci], kr[proc_ci],
    tp[proc_ci], wp[proc_ci], lp[proc_ci],
    tn[proc_ci], wn[proc_ci], ln[proc_ci]
  ];
  var pcd = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var ppcd = pcd.concat();

  var day = 1000 * 3600 * 24;
  // Cookieの有効期限(365日間)
  var ex = new Date();
  ex.setTime(now + day * 365);

  // Cookieの読み込み
  // 前回のキャストデータを取得
  for (var i = 0; i < dci.length; i++) {
    var castId = dci[i];
    if (!localStorage.getItem(castId)) {
      continue;
    }
    var castData = localStorage.getItem(castId);
    var tpcd = unescape(castData).split(":");
    var twc = parseInt(tpcd[2]);
    var tlc = parseInt(tpcd[3]);
    var twr = 0;
    if ((twc + tlc) != 0) {
      twr = Math.round(twc / (twc + tlc) * 100 * 10) / 10;
    }
    awc += twc;
    alc += tlc;
    cwra[castId] = twr;
    cwca[castId] = twc;
    clca[castId] = tlc;
    if (castId == ci) {
      pcd = tpcd;
    }
    if (castId == pci) {
      ppcd = unescape(castData).split(":");
    }
  }

  awc = awc - parseInt(pcd[2]) + wc[proc_ci];
  alc = alc - parseInt(pcd[3]) + lc[proc_ci];
  if ((awc + alc) != 0) {
    awr = Math.round(awc / (awc + alc) * 100 * 10) / 10;
  }
  cwra[ci] = wr[proc_ci];
  cwca[ci] = wc[proc_ci];
  clca[ci] = lc[proc_ci];

  // 使用率、勝利数、キャスト別評価(平均)、勝利時(平均)、敗北時(平均)で比較
  if (cd[1] != pcd[1] || cd[2] != pcd[2] || cd[8] != pcd[8] || cd[9] != pcd[9] || cd[10] != pcd[10]) {
    localStorage.setItem(ci, escape(cd.join(":")));
  }

  // 24:00を起点として比較する
  var base = new Date();
  base.setTime(pcd[0]);
  base.setHours(23);
  base.setMinutes(59);
  base.setSeconds(59);
  if (now > base.getTime()) {
    localStorage.setItem(pci, escape(pcd.join(":")));
  } else {
    pcd = ppcd;
  }

  // HTMLの書き換え
  var fi = d.querySelector('.frame_inner');
  var nfi = fi.cloneNode(true);
  nfi.id = "wlw_custom";
  var p = nfi.querySelectorAll('.clearfix');

  function insert(i, t1, t2) {
    var e = p[0].cloneNode(true);
    var t = e.getElementsByTagName('div');
    t[0].innerHTML = t1;
    t[1].innerHTML = t2;
    nfi.insertBefore(e, p[i]);
  }
  insert(2, "敗北数", lc[proc_ci] + "<span class=\"font_small\">敗</span>");
  insert(2, "勝率", wr[proc_ci] + "％");
  insert(4, "Kill Ratio", kr[proc_ci]);

  function diff(i, t) {
    var iad = Math.round((cd[i] - pcd[i]) * 100) / 100;
    var pm = "±";
    if (iad > 0) {
      pm = "+";
    }
    if (iad < 0) {
      pm = "-";
      iad = Math.abs(iad);
    }
    t.innerHTML = t.innerHTML + " <span style=\"color:#ff0000;\" class=\"font_small\">(" + pm + iad + ")</span>";
  }
  var np1 = nfi.querySelectorAll('.block_playdata_01_text');
  for (var i = 0; i < 7; i++) {
    diff(i + 1, np1[i]);
  }
  var np2 = nfi.querySelectorAll('.block_playdata_02_text');
  for (var i = 0; i < 6; i++) {
    diff(i + 8, np2[i]);
  }
  insert(6, "全キャスト勝率", awr + "％ <span class=\"font_small\">(" + awc + "勝" + alc + "敗)</span>");
  for (var i = 0; i < dci.length; i++) {
    // 試合数が0のキャストは表示しない
    if ((cwca[dci[i]] + clca[dci[i]]) > 0) {
      insert(6, "<span class=\"font_90\">" + dcn[i] + "</span>", cwra[dci[i]] + "% <span class=\"font_small\">(" + cwca[dci[i]] + "勝" + clca[dci[i]] + "敗)</span>");
    }
  }

  fi.parentNode.replaceChild(nfi, fi);

  // 表示サイズ用
  var icon_width = 0;
  var icon_height = 0;
  var icon_margin_bot = "20px";
  var frame02_margin_bot = "136px";

  var block_p_01 = d.querySelector('.block_playdata_01');

  // 画面サイズによってレイアウト用の値を設定
  if (window.innerWidth < 481) {
    //表示領域が小さい時の処理
    icon_width = 30;
    icon_height = 35;
  } else {
    //表示領域が大きい時の処理
    icon_width = 60;
    icon_height = 70;
  }

  // キャスト画像を表示
  var cb_cnt = 0;

  for (var cnt = 0; cnt < dci.length; cnt++) {
    //使用していないキャストのボタンは表示しない
    if (wc[cnt] + lc[cnt] > 0 || cnt == proc_ci) {
      imgNode_cast[cnt] = d.createElement("img");
      imgNode_cast[cnt].src = CAST_IMG_URL + castimgurl[cnt];

      imgNode_cast[cnt].width = icon_width;
      imgNode_cast[cnt].height = icon_height;

      var linkNode = d.createElement("a");
      linkNode.href = "JavaScript:changedisp(" + cnt.toString() + ")";
      linkNode.appendChild(imgNode_cast[cnt]);
      gameNode.appendChild(linkNode);

      //表示ページのキャストは半透明に設定する
      if (cnt == proc_ci) {
        //表示ページのキャストは半透明に設定する
        imgNode_cast[cnt].style.opacity = 0.5;
      }

      cb_cnt++;
    }
  }

  //10キャスト以上のボタンを表示する場合、左寄せにする
  if (cb_cnt > 9) {
    gameNode.setAttribute("align", "left");
  }

  block_p_01.parentNode.insertBefore(gameNode, block_p_01);

}

//ロールがファイターかチェックする
function chkrolepage() {
  //現在のページを取得
  var pbpo = d.querySelector('.tab_cast_on');

  if (pbpo != null) {
    if (pbpo.id != "fil_fig") {
      alert("獲得済みキャスト情報取得はファイターのタブで実行して下さい。");
      return false;
    }
  }

  return true;
}

//1ページ目かチェックする
function chkpage() {
  //現在のページを取得
  var pbpo = d.querySelector('.page_block_page_on');

  if (pbpo != null) {
    if (pbpo.textContent != "1") {
      alert("獲得済みキャスト情報取得は1ページ目で実行して下さい。");
      return false;
    }
  }
  return true;
}

//キャストIDを取得し、各キャストID変数(acqci)に設定
function getCastId() {

  var urlstr;
  var splitstr = [];

  //キャストIDを取得
  for (var i = 0; i < d.links.length; i++) {
    urlstr = d.links[i].toString();

    if (urlstr.match(/cast=/)) {
      splitstr = urlstr.split("cast=");

      acqci.push(splitstr[1]);
    }
  }
}

//キャスト名を取得し、各キャスト名変数(acqcn)に設定
function getCastName() {

  //キャスト名部分の情報を取得
  var bcc = d.querySelectorAll('.block_cast_castname');

  //キャスト名を取得
  for (var i = 0; i < bcc.length; i++) {
    acqcn.push(bcc[i].textContent);
  }
}

//cookieの保存処理
function savecookie(fpci, id) {

  // キャストデータ ... cast data
  // 前回のキャストデータ ... pre cast data
  // 日時情報、使用率、勝利数、敗北数、勝率、総撃破数、総撤退数、Kill Ratio、
  // キャスト別評価(平均)、勝利時(平均)、敗北時(平均)、
  // 獲得ナイス(平均)、勝利時(平均)、敗北時(平均)
  var now = new Date().getTime();
  var cd = [now, ur[fpci], wc[fpci], lc[fpci], wr[fpci], crc[fpci], wdc[fpci], kr[fpci],
    tp[fpci], wp[fpci], lp[fpci],
    tn[fpci], wn[fpci], ln[fpci]
  ];
  var pcd = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  //当日以前の実行データのcookie名
  var pci = "p" + id;

  var day = 1000 * 3600 * 24;
  // Cookieの有効期限(365日間)
  var ex = new Date();
  ex.setTime(now + day * 365);

  // Cookieの読み込み
  // 前回のキャストデータを取得
  if (localStorage.getItem(id)) {
    pcd = unescape(localStorage.getItem(id)).split(":");
  }

  //前回実行時の取得データと比較し、内容が違った場合cookieの内容を更新
  // 使用率、勝利数、キャスト別評価(平均)、勝利時(平均)、敗北時(平均)で比較
  if (cd[1] != pcd[1] || cd[2] != pcd[2] || cd[8] != pcd[8] || cd[9] != pcd[9] || cd[10] != pcd[10]) {
    localStorage.setItem(id, escape(cd.join(":")));
  }

  //差分の起点となるデータを設定
  // 24:00を起点として比較する
  var base = new Date();
  base.setTime(pcd[0]);
  base.setHours(23);
  base.setMinutes(59);
  base.setSeconds(59);
  if (now > base.getTime()) {
    localStorage.setItem(pci, escape(pcd.join(":")));
  }
}


// キャスト画像をクリックした場合のイベント
function changedisp(fpci) {

  //現在表示しているキャストを押下しても処理を行わない
  if (fpci != proc_ci) {

    // クリック時透過処理、前回の透過アイコンも元に戻す
    imgNode_cast[proc_ci].style.opacity = 1;
    proc_ci = fpci;
    imgNode_cast[proc_ci].style.opacity = 0.5;

    //差分表示のため、cookieからデータを取得
    // Cookieの読み込み
    // 起点のキャストデータを取得
    if (localStorage) {
      var ppcd = [];
      var pci = "p" + dci[fpci];
      ppcd = unescape(localStorage.getItem(pci)).split(":");
    }
    //表示内容を更新
    var p1 = d.querySelectorAll('.block_playdata_01_text');

    // 使用率 ... usage rate
    p1[0].innerHTML = ur[fpci].toFixed(1) + "％";
    diff_cd(ur[fpci], ppcd[1], p1[0]);

    // 勝利数 ... win count
    p1[1].innerHTML = wc[fpci] + "<span class=\"font_small\">勝</span>";
    diff_cd(wc[fpci], ppcd[2], p1[1]);

    // 敗北数
    p1[2].innerHTML = lc[fpci] + "<span class=\"font_small\">敗</span>";
    diff_cd(lc[fpci], ppcd[3], p1[2]);

    //勝率
    p1[3].innerHTML = wr[fpci].toFixed(1) + "％";
    diff_cd(wr[fpci], ppcd[4], p1[3]);

    // 総撃破数 ... crush count
    p1[4].innerHTML = crc[fpci];
    diff_cd(crc[fpci], ppcd[5], p1[4]);

    // 総撤退数 ... withdraw count
    p1[5].innerHTML = wdc[fpci];
    diff_cd(wdc[fpci], ppcd[6], p1[5]);

    //Kill Ratio
    p1[6].innerHTML = kr[fpci];
    diff_cd(kr[fpci], ppcd[7], p1[6]);

    var p2 = d.querySelectorAll('.block_playdata_02_text');

    // キャスト別評価(平均) ... total page
    p2[0].innerHTML = tp[fpci].toFixed(1) + "p";
    diff_cd(tp[fpci], ppcd[8], p2[0]);

    // 勝利時(平均) ... win page
    p2[1].innerHTML = wp[fpci].toFixed(1) + "p";
    diff_cd(wp[fpci], ppcd[9], p2[1]);

    // 敗北時(平均) ... lose page
    p2[2].innerHTML = lp[fpci].toFixed(1) + "p";
    diff_cd(lp[fpci], ppcd[10], p2[2]);

    // 獲得ナイス(平均) ... total nice
    p2[3].innerHTML = tn[fpci].toFixed(1);
    diff_cd(tn[fpci], ppcd[11], p2[3]);

    // 勝利時(平均) ... win nice
    p2[4].innerHTML = wn[fpci].toFixed(1);
    diff_cd(wn[fpci], ppcd[12], p2[4]);

    // 敗北時(平均) ... lose nice
    p2[5].innerHTML = ln[fpci].toFixed(1);
    diff_cd(ln[fpci], ppcd[13], p2[5]);
  }
}

//ボタン押下時の差分処理
function diff_cd(d1, d2, t) {
  var iad = Math.round((d1 - d2) * 100) / 100;
  var pm = "±";
  if (iad > 0) {
    pm = "+";
  }

  if (iad < 0) {
    pm = "-";
    iad = Math.abs(iad);

  }
  t.innerHTML = t.innerHTML + " <span style=\"color:#ff0000;\" class=\"font_small\">(" + pm + iad + ")</span>";
}

//各キャストページからデータを取得
function sorceget(src_txt, i) {

  var splitstr01;
  var splitstr02;

  try {

    // ログアウトされていないか確認
    if (src_txt.match("ログインフォーム")) {

      if (err_num == 0) {
        err_num = 1;
      }

    } else {

      //block_playdata_01_text部分のデータを取得
      splitstr01 = src_txt.split("block_playdata_01_text\">");

      // 使用率 ... usage rate
      splitstr02 = splitstr01[1].split("％<");
      ur[i] = parseFloat(splitstr02[0]);

      // 勝利数 ... win count
      splitstr02 = splitstr01[2].split("<");
      wc[i] = parseInt(splitstr02[0]);

      // 総撃破数 ... crush count
      splitstr02 = splitstr01[3].split("<");
      crc[i] = parseInt(splitstr02[0]);

      // 総撤退数 ... withdraw count
      splitstr02 = splitstr01[4].split("<");
      wdc[i] = parseInt(splitstr02[0]);

      //block_playdata_02_text部分のデータを取得
      splitstr01 = src_txt.split("block_playdata_02_text\">");

      // キャスト別評価(平均) ... total page
      splitstr02 = splitstr01[1].split("p<");
      tp[i] = parseFloat(splitstr02[0]);

      // 勝利時(平均) ... win page
      splitstr02 = splitstr01[2].split("p<");
      wp[i] = parseFloat(splitstr02[0]);

      // 敗北時(平均) ... lose page
      splitstr02 = splitstr01[3].split("p<");
      lp[i] = parseFloat(splitstr02[0]);

      // 獲得ナイス(平均) ... total nice
      splitstr02 = splitstr01[4].split("<");
      tn[i] = parseFloat(splitstr02[0]);

      // 勝利時(平均) ... win nice
      splitstr02 = splitstr01[5].split("<");
      wn[i] = parseFloat(splitstr02[0]);

      // 敗北時(平均) ... lose nice
      splitstr02 = splitstr01[6].split("<");
      ln[i] = parseFloat(splitstr02[0]);

      //各項目が数値かどうかチェック
      if (isFinite(ur[i]) && isFinite(wc[i]) && isFinite(crc[i]) && isFinite(wdc[i]) &&
        isFinite(tp[i]) && isFinite(wp[i]) || isFinite(lp[i]) && isFinite(tn[i]) &&
        isFinite(wn[i]) && isFinite(ln[i])) {

        // 敗北数 ... lose count
        lc[i] = 0;
        if ((tp[i] - lp[i]) != 0) {
          lc[i] = parseInt(Math.round((wp[i] - tp[i]) * wc[i] / (tp[i] - lp[i])));
        }

        // 勝率 ... win rate
        wr[i] = 0;
        if ((wc[i] + lc[i]) != 0) {
          wr[i] = Math.round(wc[i] / (wc[i] + lc[i]) * 100 * 10) / 10;
        }

        // Kill Ratio ... kill ratio
        kr[i] = 0;
        if (wdc[i] != 0) {
          kr[i] = Math.round(crc[i] / wdc[i] * 100) / 100;
        }

        //キャスト画像アドレスを取得
        splitstr01 = src_txt.split(CAST_IMG_URL);
        splitstr02 = splitstr01[1].split("\">");
        castimgurl[i] = splitstr02[0];

        //全キャスト勝率以下の箇所は、既存の処理を流用するため
        //ここで通信分の情報をcookieに格納する
        savecookie(i, dci[i]);

      } else {

        //数値でない場合
        if (err_num == 0) {
          err_num = 2;
        }
      }
    }

  } catch (e) {
    if (err_num == 0) {
      err_num = 9;
      errmsg = "\nキャストID:" + dci[i] + "\nエラー内容:" + e;
    }

  } finally {
    exe_cnt++;

    if (exe_cnt == dci.length - 1) {

      if (err_num == 0) {
        disp_proc();
      } else if (err_num == 1) {
        alert("通信エラーが発生しました。\nログアウトされています。\n再度ログインして実行してください。");
      } else if (err_num == 2) {
        alert("通信エラーが発生しました。\nキャストページへ正常にアクセスできませんでした。\n通信が不安定になっているか、またはサーバが応答していません。");
      } else if (err_num == 9) {
        alert("想定外のエラーが発生しました。\n出来れば当メッセージと発生時の状況をお知らせください。" + errmsg);
      }
    }
  }
}

//通信リクエストを生成する
function create_request(url, index) {
  try {
    var request = new XMLHttpRequest();

    request.open("GET", url);

    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        sorceget(request.responseText, index);
      }
    };

    request.send(null);

  } catch (e) {
    request.abort();
  }
}
