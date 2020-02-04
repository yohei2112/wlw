javascript:

var d = document;

var CAST_LIST_URL = "https://wonderland-wars.net/mycast.html";

var CAST_URL = "https://wonderland-wars.net/castdetail.html?cast=";

//ADD START キャスト一覧で獲得済みキャスト情報を取得してIDと名称をcookieに格納

//マイキャスト一覧で実行された場合、獲得済みキャスト情報を取得
if(d.URL == CAST_LIST_URL){

	//各キャストID
	var acqci = [];

	//各キャスト名
	var acqcn = [];


	//タブがファイターの場合
	if(chkrolepage()){

		//1ページ目の場合
		if(chkpage()){

			//タブボタンを取得
			var ptbp = d.querySelectorAll('.tab_cast');

			//タブ数を取得
			var tabcnt = ptbp.length;

			//ページボタン保存変数
			var pbp;

			//タブ分回す
			for (var ti = -1; ti < tabcnt; ti++) {

				//初回時以外
				if(ti != -1){

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
				if(pbp.length != 0){

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
			var day = 1000*3600*24;
			// Cookieの有効期限(365日間)
			var ex = new Date();
			ex.setTime(now+day*365);

			//キャストIDをcookieに保存
			d.cookie = "acqci" + "=" + escape(acqci.join(":")) + "; expires=" + ex.toUTCString();

			//キャストIDをcookieに保存
			d.cookie = "acqcn" + "=" + escape(acqcn.join(":")) + "; expires=" + ex.toUTCString();

			alert("獲得済みキャスト情報取得が完了しました。\n各キャストのページでブックマークレットを実行することで、勝率などを確認できます。\n新たなキャストを獲得した場合は、再度獲得済みキャスト情報取得を行ってください。\n獲得済みキャスト数：" + acqci.length);

		}
	}

}else if(d.URL.indexOf(CAST_URL) >= 0){

//ADD END

	if (d.getElementById('wlw_custom')==null) {

		var p1 = d.querySelectorAll('.block_playdata_01_text');
		// 使用率 ... usage rate
		var ur = parseFloat(p1[0].innerHTML);
		// 勝利数 ... win count
		var wc = parseInt(p1[1].innerHTML);
		// 総撃破数 ... crush count
		var crc = parseInt(p1[2].innerHTML);
		// 総撤退数 ... withdraw count
		var wdc = parseInt(p1[3].innerHTML);

		var p2 = d.querySelectorAll('.block_playdata_02_text');
		// キャスト別評価(平均) ... total page
		var tp = parseFloat(p2[0].innerHTML);
		// 勝利時(平均) ... win page
		var wp = parseFloat(p2[1].innerHTML);
		// 敗北時(平均) ... lose page
		var lp = parseFloat(p2[2].innerHTML);

		// 獲得ナイス(平均) ... total nice
		var tn = parseFloat(p2[3].innerHTML);
		// 勝利時(平均) ... win nice
		var wn = parseFloat(p2[4].innerHTML);
		// 敗北時(平均) ... lose nice
		var ln = parseFloat(p2[5].innerHTML);

		// 敗北数 ... lose count
		var lc = 0;
		if ((tp-lp)!=0) {
		lc = parseInt(Math.round((wp-tp)*wc/(tp-lp)));
		}
		// 勝率 ... win rate
		var wr = 0;
		if ((wc+lc)!=0) {
		wr = Math.round(wc/(wc+lc)*100*10)/10;
		}
		// Kill Ratio ... kill ratio
		var kr = 0;
		if (wdc!=0) {
		kr = Math.round(crc/wdc*100)/100;
		}

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

		//UPDATE START 各キャストIDと名前の固定値を削除

		// 表示する各キャストのID ... display cast id
		var dci = [];
		// 表示する各キャストの名前 ... display cast name
		var dcn = [];

		//UPDATE END

		//ADD START 各キャストのIDと名前をcookieから設定

		//cookieからデータを取得
		if (d.cookie) {
			var c = d.cookie.split(";");
			for (var i = 0; i < c.length; i++) {
				var kv = c[i].trim().split("=");

				if(kv[0] == "acqci"){
					dci = unescape(kv[1]).split(":");
				}else if(kv[0] == "acqcn"){
					dcn = unescape(kv[1]).split(":");
				}
			}
		}

		//キャストIDが取得できた場合
		if(dci.length != 0){

		//ADD END

			// 初期化
			for (var i = 0; i < dci.length; i++) {
			cwra[dci[i]] = 0;
			cwca[dci[i]] = 0;
			clca[dci[i]] = 0;
			}

			// キャストID ... cast id
			// 文字数圧縮のため、パラメータはcastを前提とする
			var q = window.location.search.substring(1);
			var ci = q.split("=")[1];
			var pci = "p" + ci;

			// キャストデータ ... cast data
			// 前回のキャストデータ ... pre cast data
			// 日時情報、使用率、勝利数、敗北数、勝率、総撃破数、総撤退数、Kill Ratio、
			// キャスト別評価(平均)、勝利時(平均)、敗北時(平均)、
			// 獲得ナイス(平均)、勝利時(平均)、敗北時(平均)
			var now = new Date().getTime();
			var cd = [now, ur, wc, lc, wr, crc, wdc, kr, tp, wp, lp, tn, wn, ln];
			var pcd = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			var ppcd = pcd.concat();

			var day = 1000*3600*24;
			// Cookieの有効期限(365日間)
			var ex = new Date();
			ex.setTime(now+day*365);

			// Cookieの読み込み
			// 前回のキャストデータを取得
			if (d.cookie) {
			var c = d.cookie.split(";");
			for (var i = 0; i < c.length; i++) {
				var kv = c[i].trim().split("=");
				var tpcd = unescape(kv[1]).split(":");
				if (isFinite(kv[0])) {
					var twc = parseInt(tpcd[2]);
					var tlc = parseInt(tpcd[3]);
					var twr = 0;
					if ((twc+tlc)!=0) {
						twr = Math.round(twc/(twc+tlc)*100*10)/10;
					}
					awc += twc;
					alc += tlc;
					cwra[kv[0]] = twr;
					cwca[kv[0]] = twc;
					clca[kv[0]] = tlc;
				}
				if (kv[0] == ci) {
					pcd = tpcd;
				}
				if (kv[0] == pci) {
					ppcd = unescape(kv[1]).split(":");
				}
			}
			}

			awc = awc - parseInt(pcd[2]) + wc;
			alc = alc - parseInt(pcd[3]) + lc;
			if ((awc+alc)!=0) {
			awr = Math.round(awc/(awc+alc)*100*10)/10;
			}
			cwra[ci] = wr;
			cwca[ci] = wc;
			clca[ci] = lc;

			// 使用率、勝利数、キャスト別評価(平均)、勝利時(平均)、敗北時(平均)で比較
			if (cd[1]!=pcd[1] || cd[2]!=pcd[2] || cd[8]!=pcd[8] || cd[9]!=pcd[9] || cd[10]!=pcd[10]) {
			d.cookie = ci + "=" + escape(cd.join(":")) + "; expires=" + ex.toUTCString();
			}

			// 24:00を起点として比較する
			var base = new Date();
			base.setTime(pcd[0]);
			base.setHours(23);
			base.setMinutes(59);
			base.setSeconds(59);
			if (now > base.getTime()) {
			d.cookie = pci + "=" + escape(pcd.join(":")) + "; expires=" + ex.toUTCString();
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
			insert(2,"敗北数",lc+"<span class=\"font_small\">敗</span>");
			insert(2,"勝率",wr+"%");
			insert(4,"Kill Ratio",kr);
			function diff(i, t) {
			var iad = Math.round((cd[i]-pcd[i])*100)/100;
			var pm = "±";
			if (iad>0) {
				pm = "+";
			}
			if (iad<0) {
				pm = "-";
				iad = Math.abs(iad);
			}
			t.innerHTML = t.innerHTML + " <span style=\"color:#ff0000;\" class=\"font_small\">(" + pm + iad + ")</span>";
			}
			var np1 = nfi.querySelectorAll('.block_playdata_01_text');
			for (var i = 0; i < 7; i++) {
			diff(i+1, np1[i]);
			}
			var np2 = nfi.querySelectorAll('.block_playdata_02_text');
			for (var i = 0; i < 6; i++) {
			diff(i+8, np2[i]);
			}
			insert(6, "全キャスト勝率", awr+"% <span class=\"font_small\">("+awc+"勝"+alc+"敗)</span>");
			for (var i = 0; i < dci.length; i++) {
			// 試合数が0のキャストは表示しない
			if ((cwca[dci[i]]+clca[dci[i]])>0) {
				insert(6, "<span class=\"font_90\">"+dcn[i]+"</span>", cwra[dci[i]]+"% <span class=\"font_small\">("+cwca[dci[i]]+"勝"+clca[dci[i]]+"敗)</span>");
			}
			}

			fi.parentNode.replaceChild(nfi, fi);

		}else{

			alert("獲得済みキャスト情報が取得できませんでした。\nマイキャスト一覧で獲得済みキャスト情報取得を実行してください。");
		}
	}
}else{
	alert("実行するページを間違えています。\n下記のページで実行してください。\nマイキャスト一覧\n「" + CAST_LIST_URL + "」\n各キャストページ\n「" + CAST_URL + "XX」");
}

//ADD START 獲得済みキャスト情報取得で使用するfunctionを追加

//ロールがファイターかチェックする
function chkrolepage(){
	//現在のページを取得
	var pbpo = d.querySelector('.tab_cast_on');

	if(pbpo != null){
		if(pbpo.id != "fil_fig"){
			alert("獲得済みキャスト情報取得はファイターのタブで実行して下さい。");
			return false;
		}
	}

	return true;
}

function chkpage(){
	//現在のページを取得
	var pbpo = d.querySelector('.page_block_page_on');

	if(pbpo != null){
		if(pbpo.textContent != "1"){
			alert("獲得済みキャスト情報取得は1ページ目で実行して下さい。");
			return false;
		}
	}
	return true;
}

//キャストIDを取得し、各キャストID変数(acqci)に設定
function getCastId(){

	var urlstr;
	var splitstr = [];

	//キャストIDを取得
	for (var i = 0; i < d.links.length; i++) {
		urlstr = d.links[i].toString();

		if(urlstr.match(/cast=/)){
			splitstr = urlstr.split("cast=");

			acqci.push(splitstr[1]);
		}
	}
}

//キャスト名を取得し、各キャスト名変数(acqcn)に設定
function getCastName(){

	//キャスト名部分の情報を取得
	var bcc = d.querySelectorAll('.block_cast_castname');

	//キャスト名を取得
	for (var i = 0; i < bcc.length; i++) {
		acqcn.push(bcc[i].textContent);
	}
}

//ADD END
