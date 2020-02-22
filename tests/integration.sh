#!/bin/bash

host=(      http://0.0.0.0:12345 )
httpbin=(   http://httpbin.org   )
httpsbin=(  https://httpbin.org  )

curl $host/$httpbin/ip -XGET
curl $host/$httpbin/post -XPOST -d '{"sentinel": 1}'
curl $host/$httpsbin/post -XPOST -d '{"sentinel": 1}'
