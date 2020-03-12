if (location.origin === 'https://youyinnn.github.io') {
    var xmlhttp2 = new XMLHttpRequest();
    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
            let rsjson = JSON.parse(xmlhttp2.responseText)
            if (rsjson.status === 0) {
                // tricky: github pages building
                setTimeout(() => {
                    window.location.href = 'https://youyinnn.gitee.io' + location.pathname + '?fromgithub=true'
                }, 400);
            }
        }
    }
    xmlhttp2.open("GET", "https://api.map.baidu.com/location/ip?ak=GDuCkcOTursQT2efQrpvw2g3ufIGz7rK", true);
    xmlhttp2.send()
}