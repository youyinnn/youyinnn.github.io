var befoe_loaded = [

]

for (rs of befoe_loaded) {
    loadIfIsTarget(rs)
}

var after_loaded_stage_1 = [{
    url: hoturl('/resources/resources.js'),
    target: ['*'],
    callback: () => {
        for (let i = 0; i < resourcesList.length; i++) {
            if (location.hostname !== 'youyinnn.github.io') {
                resourcesList[i] = '/resources/' + resourcesList[i]
            } else {
                resourcesList[i] = 'https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@latest/resources/' + resourcesList[i]
            }
            resourcesList[i] = {
                url: resourcesList[i],
                target: ['*']
            }
        }
        // resources js loading
        for (rs of resourcesList) {
            loadIfIsTarget(rs)
        }
        // after before js loading
        for (rs of after_loaded_stage_2) {
            loadIfIsTarget(rs)
        }
    }
}, ]

var after_loaded_stage_2 = [{
        url: hoturl('/myjs/after_loaded_stage_3.js'),
        target: ['*'],
        callback: () => {
            for (rs of after_loaded_stage_3) {
                loadIfIsTarget(rs)
            }
        }
    }
]

loadJsAfterDOMLoaded(() => {
    for (rs of after_loaded_stage_1) {
        loadIfIsTarget(rs)
    }
})

function hoturl(url) {
    return url + '?hot=' + new Date().getTime()
}

function loadIfIsTarget(rs) {
    if (rs.target.find(path => location.pathname.startsWith(path) || path === '*')) {
        let url = Boolean(rs.hot) ? hoturl(rs.url) : rs.url
        load(url, {
            async: rs.async !== undefined ? rs.async : false,
            attrs: rs.attrs
        }, (err, script) => {
            if (err === null) {
                console.debug(script.src + ' |||---Loaded')
                if (rs.callback !== undefined) {
                    try {
                        rs.callback(script)
                    } catch (error) {
                        console.error(error)
                    }
                }
            } else {
                console.error(err)
            }
        })
    }
}

function loadJsAfterDOMLoaded(cb) {
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function() {
            document.removeEventListener('DOMContentLoaded', arguments.callee, false)
            cb()
        }, false)
    } else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState === 'complete') {
                document.detachEvent('onreadystatechange', arguments.callee)
                cb()
            }
        })
    } else if (document.lastChild === document.body) {
        cb()
    }
}