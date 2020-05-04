var before = [
    'https://cdn.jsdelivr.net/npm/katex@0.10.0-rc.1/dist/katex.min.js',
    'https://cdn.jsdelivr.net/npm/algoliasearch@4/dist/algoliasearch-lite.umd.js',
]

for (let i = 0; i < resourcesList.length; i++) {
    if (location.hostname !== 'youyinnn.github.io') {
        resourcesList[i] = '/resources/' + resourcesList[i]
    } else {
        resourcesList[i] = 'https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@master/resources/' + resourcesList[i]
    }
}

var after = [
    'https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@master/js/jquery.js',
    'https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@master/js/jquery.hotkeys.js',
    'https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@master/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@master/js/dayjs.min.js',
    'https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@master/js/yaml.min.js',
    'https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@master/lib/clipboard.js',
    'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@latest/build/highlight.min.js',
    'https://cdn.jsdelivr.net/npm/valine@1.4.4/dist/Valine.min.js',
    
    '/myjs/tool.js',
    '/myjs/githubapi.js',
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
        },function (err, script) {
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
        for (el of document.getElementsByClassName('markdown-body')) {
            renderMathInElement(el)
        }
    })
}

document.addEventListener('DOMContentLoaded', function () {
    importJsAfterLoad()
})