import urllib.request,urllib.error,json,uuid,pathlib
BASE='http://localhost:5173'
def request(path,method='GET',body=None,auth=False,origin=True,content_type='application/json'):
    headers={}
    if auth: headers['Cookie']='__sites_local_auth=1'
    if origin: headers['Origin']=BASE
    if body is not None: headers['Content-Type']=content_type
    req=urllib.request.Request(BASE+path,data=body,headers=headers,method=method)
    try:
        with urllib.request.urlopen(req) as response:return response.status,response.read()
    except urllib.error.HTTPError as e:return e.code,e.read()
assert request('/api/admin/projects')[0]==403
assert request('/api/admin/projects',auth=True)[0]==200
assert request('/api/admin/projects','PUT',b'{}',True,False)[0]==403
boundary='portfolio-test-boundary'
image=pathlib.Path('public/portfolio/chair.webp').read_bytes()
body=(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="test-chair.webp"\r\nContent-Type: image/webp\r\n\r\n').encode()+image+f'\r\n--{boundary}--\r\n'.encode()
status,data=request('/api/admin/upload','POST',body,True,content_type='multipart/form-data; boundary='+boundary)
assert status==200,(status,data)
media=json.loads(data)
assert request(media['url'])[0]==404
assert request(media['url'],auth=True)[0]==200
p={'id':'qa-local-project','title':'QA LOCAL PROJECT','category':'Test','summary':'Local integration test','body':'Only test data','media':[media],'published':False,'position':9999}
assert request('/api/admin/projects','PUT',json.dumps(p).encode(),True)[0]==200
assert request('/projekte/qa-local-project')[0]==404
p['published']=True
assert request('/api/admin/projects','PUT',json.dumps(p).encode(),True)[0]==200
assert request('/projekte/qa-local-project')[0]==200
assert request(media['url'])[0]==200
assert b'QA LOCAL PROJECT' in request('/')[1]
p['published']=False
assert request('/api/admin/projects','PUT',json.dumps(p).encode(),True)[0]==200
assert request(media['url'])[0]==404
assert request('/projekte/qa-local-project')[0]==404
pathlib.Path('work/local-test-result.json').write_text(json.dumps({'result':'passed','checks':['anonymous write denied','admin read allowed','origin rejection','upload and persistence','draft media private','published media visible','project detail navigation','unpublish revokes access'],'test_project':p['id'],'test_upload':media['url'].split('/')[-1]},indent=2))
print('PASS: admin authorization, CSRF, upload, draft, publish, media access, unpublish')
