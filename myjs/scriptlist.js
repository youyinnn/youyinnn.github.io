var before = [{
    url: 'https://cdn.jsdelivr.net/npm/algoliasearch@4/dist/algoliasearch-lite.umd.js',
    target: ['/articles/']
}, ]

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

var after = [{
        url: 'https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    },
    {
        url: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/js/bootstrap.bundle.min.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    },
    {
        url: 'https://cdn.jsdelivr.net/npm/dayjs@1.8.27/dayjs.min.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    },
    {
        url: 'https://cdn.jsdelivr.net/npm/js-yaml@3.13.1/dist/js-yaml.min.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    },
    {
        url: 'https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    },
    {
        url: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.0.3/build/highlight.min.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    },
    {
        url: 'https://cdn.jsdelivr.net/npm/valine@1.4.14/dist/Valine.min.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    },
    {
        url: 'https://cdn.jsdelivr.net/gh/youyinnn/youyinnn.github.io@latest/lib/jquery.hotkeys.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    },
    {
        url: 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js',
        target: ['*'],
        attrs: {
            defer: true,
            integrity: 'sha384-y23I5Q6l+B6vatafAwxRu/0oK/79VlbSz7Q9aiSZUvyWYIYsd+qj+o24G5ZU2zJz',
            crossorigin: 'anonymous'
        }
    },
    {
        url: 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js',
        target: ['*'],
        attrs: {
            defer: true,
            integrity: 'sha384-kWPLUVMOks5AQFrykwIup5lo0m3iMkkHrD0uJ4H5cjeGihAutqP0yW0J6dpFiVkI',
            crossorigin: 'anonymous'
        },
        callback: () => {
            for (el of document.getElementsByTagName('p')) {
                if (el.innerHTML.match(/^\$\$.*\$\$$/) !== null) {
                    el.innerHTML = el.innerText
                    renderMathInElement(el)
                } else {
                    let inp = el.innerHTML.match(/\$\$[^$]*\$\$/)
                    while (inp !== null) {
                        let e = el.innerText.match(/\$\$[^$]*\$\$/)[0]
                        let ehtml = '<span class="katex-display">' + katex.renderToString(e.substring(2, e.length - 2), {
                            throwOnError: false
                        }) + '</span>'
                        el.innerHTML = el.innerHTML.replace(inp[0], ehtml)
                        inp = el.innerHTML.match(/\$\$[^$]*\$\$/)
                    }
                }
            }
        }
    },


    {
        url: '/myjs/tool.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    },
    {
        url: '/myjs/eventbind.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    },
    {
        url: '/myjs/elementcreate.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    },
    {
        url: '/myjs/main.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    },
    {
        url: '/myjs/init.js',
        target: ['*'],
        attrs: {
            defer: true
        }
    }
]

after = resourcesList.concat(after)

function loadIfIsTarget(rs) {
    if (rs.target.find(path => path === location.pathname || path === '*')) {
        load(rs.url, {
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

function importJsBeforeLoad() {
    for (rs of before) {
        loadIfIsTarget(rs)
    }
}

importJsBeforeLoad()

function importJsAfterLoad() {
    for (rs of after) {
        loadIfIsTarget(rs)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    importJsAfterLoad()
})