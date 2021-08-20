var target = 'https://youyinnn.gitee.io'

function cb(rs) {
    if (rs.status === 0) {
        // chinese visitor
        sessionStorage.setItem('__ischinese', 'yes')
        window.location.href = target + location.pathname + '?fromgithub=true'
    } else {
        // foreign visitor
        sessionStorage.setItem('__isforeigner', 'yes')
    }
}

// if (sessionStorage.getItem('__ischinese') === 'yes') {
//     // chinese user should always jump to gitee
//     window.location.href = target + location.pathname + '?fromgithub=true'
// } else if (
//     // only in visiting github pages
//     location.origin === 'https://youyinnn.github.io' &&
//     // and non foreign user
//     sessionStorage.getItem('__isforeigner') !== 'yes') {

//     load('https://api.map.baidu.com/location/ip?ak=GDuCkcOTursQT2efQrpvw2g3ufIGz7rK&callback=cb', {
//         async: true
//     })
// }