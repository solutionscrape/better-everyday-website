"""Dependency-free checks against deployable HTML and Netlify route contracts."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import tomllib
import re

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'dist'
ROUTES = ['', 'work-with-james', 'book-shop', 'community', 'about', 'blog', 'resources', 'contact']

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.refs=[]; self.ids=[]; self.h1=0; self.mains=0; self.title=''; self.title_on=False
        self.description=False; self.language=False; self.navs=[]; self.nav=None
        self.schema=False; self.schema_text=''; self.schemas=[]; self.images=[]; self.buttons=[]
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.append(a['id'])
        if tag=='html': self.language=a.get('lang')=='en'
        if tag=='h1': self.h1+=1
        if tag=='main': self.mains+=1
        if tag=='title': self.title_on=True
        if tag=='meta' and a.get('name')=='description': self.description=bool(a.get('content'))
        if tag=='nav': self.nav=[]; self.navs.append((a.get('aria-label'),self.nav))
        if tag=='a':
            assert a.get('href') and a['href'] != '#', 'Empty/placeholder link'
            if self.nav is not None: self.nav.append(a)
        for attr in ['href','src']:
            if attr in a: self.refs.append(a[attr])
        if tag=='img':
            assert 'alt' in a and a['alt'], 'Image missing meaningful alt'
            assert int(a.get('width',0))>0 and int(a.get('height',0))>0, 'Image needs dimensions'
            assert a['src'].startswith('/assets/'), 'Images must be self-hosted'
            self.images.append(a)
        if tag=='button': self.buttons.append(a)
        if tag=='script' and a.get('type')=='application/ld+json': self.schema=True; self.schema_text=''
        assert tag not in ['iframe','form'], 'Unverified integration added'
    def handle_endtag(self, tag):
        if tag=='title': self.title_on=False
        if tag=='nav': self.nav=None
        if tag=='script' and self.schema:
            self.schemas.append(json.loads(self.schema_text)); self.schema=False
    def handle_data(self, data):
        if self.title_on: self.title+=data
        if self.schema: self.schema_text+=data

def resolve(path):
    target=PUBLIC/unquote(path).lstrip('/')
    if target.is_dir(): target=target/'index.html'
    assert target.resolve().is_relative_to(PUBLIC.resolve()), 'Path escapes publish dir'
    return target

pages={}
for file in PUBLIC.rglob('*.html'):
    page=Page(file.read_text()); pages[file]=page
    assert page.language and page.h1==1 and page.mains==1, f'Landmarks: {file}'
    assert len(page.ids)==len(set(page.ids)), f'Duplicate IDs: {file}'
    assert page.title, f'Missing title: {file}'
    for ref in page.refs:
        u=urlsplit(ref)
        if u.scheme or u.netloc:
            assert u.scheme in ['https','mailto','tel'], f'Unsafe protocol: {ref}'
            continue
        assert u.path.startswith('/') or not u.path, f'Use root-relative references: {ref}'
        target=resolve(u.path) if u.path else file
        assert target.is_file(), f'Broken reference in {file}: {ref}'
        if u.fragment:
            target_page=page if target==file else Page(target.read_text())
            assert u.fragment in target_page.ids, f'Missing anchor: {ref}'
expected=['/'+slug+'/' if slug else '/' for slug in ROUTES]
for slug in ROUTES:
    file=resolve('/'+slug+'/') if slug else PUBLIC/'index.html'
    p=pages[file]
    assert p.description and p.schemas, f'Missing metadata: {file}'
    main_nav=next(items for label,items in p.navs if label=='Main navigation')
    assert [a['href'] for a in main_nav]==expected, f'Navigation inconsistent: {file}'
    current=[a for a in main_nav if a.get('aria-current')=='page']
    assert len(current)==1 and current[0]['href']==('/'+slug+'/' if slug else '/')
    assert any(b.get('aria-controls')=='site-nav' and b.get('aria-expanded')=='false' for b in p.buttons)
assert len({p.title for p in pages.values()})==len(pages), 'Titles should be unique'
config=tomllib.loads((ROOT/'netlify.toml').read_text())
assert config['build']['publish']=='dist'
redirects=config['redirects']
assert not any(r['from']=='/*' and r.get('status')==200 for r in redirects), 'Avoid masking 404s as homepage'
for old,new in [('/services','/work-with-james/'),('/store','/book-shop/')]:
    r=next(r for r in redirects if r['from']==old)
    assert r['to']==new and r['status']==301 and resolve(new).is_file()
for source in ['/store/*','/blog/*','/cart']:
    r=next(r for r in redirects if r['from']==source)
    assert r['to'].startswith('https://www.mybettereveryday.org/') and r['status']==302
    assert not r.get('force'), 'Landing files must shadow wildcard redirects'
assert resolve('/404.html').is_file()
for ref in re.findall(r"url\(['\"]?([^)'\"]+)", (PUBLIC/'assets/styles.css').read_text()):
    assert resolve(ref).is_file(), f'Broken CSS asset: {ref}'
# Brand blue uses dark text because white normal text fails AA on that blue.
def luminance(h):
    c=[int(h[i:i+2],16)/255 for i in (1,3,5)]
    c=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c]
    return sum(v*w for v,w in zip(c,[.2126,.7152,.0722]))
def contrast(a,b):
    a,b=sorted([luminance(a),luminance(b)])
    return (b+.05)/(a+.05)
for fg,bg in [('#101012','#1e90d4'),('#b9c1cb','#101012'),('#b9c1cb','#1b1d22'),('#ffffff','#1b1d22')]:
    assert contrast(fg,bg)>=4.5, f'Text contrast fails AA: {fg} on {bg}'
print(f'PASS: {len(ROUTES)} pages + 404; internal routes, assets, anchors, metadata, navigation, Netlify config and text contrast.')
