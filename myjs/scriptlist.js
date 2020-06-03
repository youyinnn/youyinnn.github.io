var before = [
    'https://cdn.jsdelivr.net/npm/algoliasearch@4/dist/algoliasearch-lite.umd.js',
]

for (let i = 0; i < resourcesList.length; i++) {
    if (location.hostname !== 'youyinnn.github.io') {
        resourcesList[i] = '/resources/' + resourcesList[i]
    } else {
        resourcesList[i] = 'https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@latest/resources/' + resourcesList[i]
    }
}

var after = [
    'https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/dayjs@1.8.27/dayjs.min.js',
    'https://cdn.jsdelivr.net/npm/js-yaml@3.13.1/dist/js-yaml.min.js',
    'https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js',
    'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.0.3/build/highlight.min.js',
    'https://cdn.jsdelivr.net/npm/valine@1.4.14/dist/Valine.min.js',

    'https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@latest/lib/jquery.hotkeys.js',

    '/myjs/tool.js',
    '/myjs/eventbind.js',
    '/myjs/elementcreate.js',
    '/myjs/main.js',
    '/myjs/init.js',
]

after = resourcesList.concat(after)

function importJsBeforeLoad() {
    for (path of before) {
        load(path, {
            async: false
        })
    }
}

importJsBeforeLoad()

function importJsAfterLoad() {
    let map = {}
    map.defer = true
    for (path of after) {
        load(path, {
            async: false,
            attrs: map
        }, function(err, script) {
            console.debug(script.src)
        })
    }

    // specially loading for KaXTex https://katex.org/docs/autorender.html
    map.integrity = 'sha384-y23I5Q6l+B6vatafAwxRu/0oK/79VlbSz7Q9aiSZUvyWYIYsd+qj+o24G5ZU2zJz'
    map.crossorigin = 'anonymous'
    load('https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js', {
        async: false,
        attrs: map
    })
    map.integrity = 'sha384-kWPLUVMOks5AQFrykwIup5lo0m3iMkkHrD0uJ4H5cjeGihAutqP0yW0J6dpFiVkI'
    load('https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js', {
        async: false,
        attrs: map
    }, () => {
        for (el of document.getElementsByTagName('p')) {
            if (el.innerHTML.match(/^\$\$.*\$\$$/) !== null) {
                el.innerHTML = el.innerText
                renderMathInElement(el)
            } else {
                let inp = el.innerHTML.match(/\$\$.*\$\$/)
                if (inp !== null) {
                    let e = el.innerText.match(/\$\$\s*.*\s*\$\$/)[0]
                    let ehtml = '<span class="katex-display">' + katex.renderToString(e.substring(2, e.length - 2), {
                        throwOnError: false
                    }) + '</span>'
                    el.innerHTML = el.innerHTML.replace(inp[0], ehtml)
                }
            }
        }
    })
}

document.addEventListener('DOMContentLoaded', function() {
    importJsAfterLoad()
})