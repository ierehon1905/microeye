from urllib import request, parse


class Pusher:
    def __init__(self, host: str):
        self.host = host

    def push_metric(self, name: str, value: float, labels: dict):
        data = parse.urlencode(
            {
                "name": name,
                "value": value,
                "labels": labels,
            }
        ).encode()
        req = request.Request(f"{self.host}/push", data=data)
        request.urlopen(req)
