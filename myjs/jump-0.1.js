if (location.origin === 'https://youyinnn.github.io') {
    var xmlhttp2 = new XMLHttpRequest();
    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
            let rsjson = JSON.parse(xmlhttp2.responseText)
            if (rsjson.country_code === 'CN') {
                // tricky: github pages building
                setTimeout(() => {
                    window.location.href = 'https://youyinnn.gitee.io' + location.pathname + '?fromgithub=true'
                }, 300);
            }
        }
    }
    xmlhttp2.open("GET", "https://freegeoip.app/json/", true);
    xmlhttp2.send()
}