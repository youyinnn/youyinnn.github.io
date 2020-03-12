if (sessionStorage.getItem('__ischinese') === 'yes') {
    // chinese user should always jump to gitee
    window.location.href = 'https://youyinnn.gitee.io' + location.pathname + '?fromgithub=true'
} else if (// only in visiting github pages
    location.origin === 'https://youyinnn.github.io' 
    // and non foreign user
    && sessionStorage.getItem('__isforeigner') !== 'yes') {
    // should do the ip check
    var xmlhttp2 = new XMLHttpRequest();
    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
            let rsjson = JSON.parse(xmlhttp2.responseText)
            if (rsjson.data.provinceId !== 999999) {
                // chinese visitor
                sessionStorage.setItem('__ischinese', 'yes')
                window.location.href = 'https://youyinnn.gitee.io' + location.pathname + '?fromgithub=true'
            } else {
                // foreign visitor
                sessionStorage.setItem('__isforeigner', 'yes')
            }
        }
    }
    xmlhttp2.open("GET", "https://www.mxnzp.com/ip/self?app_id=zqnqmetwqpginyrk&app_secret=V21yN25pMGdVSS9ORUNtTGI4UDMrUT09", true);
    xmlhttp2.send()
}