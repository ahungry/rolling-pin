#!/bin/bash

host=(      http://0.0.0.0:12345 )
httpbin=(   http://httpbin.org   )
httpsbin=(  https://httpbin.org  )

json=('Content-Type: application/json')

curl -w'\n' $host/$httpbin/ip    -XGET
curl -w'\n' $host/$httpbin/post  -XPOST -d '{"sentinel": 1}' -H "$json"
curl -w'\n' $host/$httpsbin/post -XPOST -d '{"sentinel": 1}' -H "$json"
