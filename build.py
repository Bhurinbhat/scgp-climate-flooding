"""Build index.html = src/base.html (original page) + src/addon (Water Management link, live feed, interactions; Drought and Air quality & Heat pages)."""
import pathlib
R = pathlib.Path(__file__).parent
s = (R / 'src/base.html').read_text(encoding='utf-8')
css = (R / 'src/addon/wmd2.css').read_text(encoding='utf-8')
js = (R / 'src/addon/wmd-data.js').read_text(encoding='utf-8') + '\n' + (R / 'src/addon/wmd2-link.js').read_text(encoding='utf-8')
# Drought / Air quality & Heat pages: snapshot data (fallback) is placed inside the add-on's closure
cjs = (R / 'src/addon/climate2.js').read_text(encoding='utf-8').replace('(function(){', '(function(){\n' + (R / 'src/addon/climate2-data.js').read_text(encoding='utf-8'), 1)
css += '\n' + (R / 'src/addon/climate2.css').read_text(encoding='utf-8')
js += '\n' + cjs
assert s.count('</style>') == 1 and s.count('</body>') == 1
s = s.replace('</style>', css + '\n</style>', 1).replace('</body>', '<script>\n' + js + '\n</script>\n</body>', 1)
(R / 'public').mkdir(exist_ok=True)
(R / 'public/index.html').write_text(s, encoding='utf-8')
print('public/index.html', len(s))
