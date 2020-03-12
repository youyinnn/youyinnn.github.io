if (location.origin === 'https://youyinnn.github.io') {
    var xmlhttp2 = new XMLHttpRequest();
    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
            let rsjson = JSON.parse(xmlhttp2.responseText)
            if (rsjson.data.provinceId !== 999999) {
                // tricky: github pages building
                window.location.href = 'https://youyinnn.gitee.io' + location.pathname + '?fromgithub=true'
            }
        }
    }
    xmlhttp2.open("GET", "https://www.mxnzp.com/ip/self?app_id=zqnqmetwqpginyrk&app_secret=V21yN25pMGdVSS9ORUNtTGI4UDMrUT09", true);
    xmlhttp2.send()
}