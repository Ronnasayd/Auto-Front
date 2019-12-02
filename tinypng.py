#!/usr/bin/python3
import requests
import os
import sys


headers = {
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0",
    "Accept": "*/*",
    "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3",
    "Accept-Encoding": "gzip, deflate",
    "Referer": "https://tinypng.com/",
    "Connection": "close",
    "Cookie": "__stripe_mid=1e4996fc-4939-4005-a885-c7e2ffa40a76; __stripe_sid=f90f9ab5-776f-4bb2-9d30-b8f53bf20734; _ga=GA1.2.2045846871.1575183214; _gid=GA1.2.591348022.1575183214",
}


list_of_files = [file for file in os.listdir(
    sys.argv[1]) if os.path.isfile(os.path.join(sys.argv[1], file))]


def compress_image(filename):
    path = os.path.join(sys.argv[1], filename)
    url_download = ''
    with open(path, "rb") as file:
        resp = requests.post("https://tinypng.com/web/shrink",
                             headers=headers, data=file.read())
        print(resp.status_code, ' filename:', filename, ' \tratio: ',
              resp.json().get('output').get('ratio'))
        url_download = resp.json().get('output').get('url')
        file.close()
    resp = requests.get(url_download)
    with open(path, "wb") as file:
        file.write(resp.content)
        file.close()


for filename in list_of_files:
    compress_image(filename)
