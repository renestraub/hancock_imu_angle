import sys


# https://github.com/Nakiami/MultithreadedSimpleHTTPServer/blob/master/MultithreadedSimpleHTTPServer.py

try:
    # Python 2.x
    from SocketServer import ThreadingMixIn
    from SimpleHTTPServer import SimpleHTTPRequestHandler
    from BaseHTTPServer import HTTPServer
except ImportError:
    # Python 3.x
    from socketserver import ThreadingMixIn
    from http.server import SimpleHTTPRequestHandler, HTTPServer


class ThreadingSimpleServer(ThreadingMixIn, HTTPServer):
    pass


def main():
    print("Starting HTTP Server on port 8888")
    server = ThreadingSimpleServer(('', 8888), SimpleHTTPRequestHandler)
    
    try:
        while True:
            sys.stdout.flush()
            server.handle_request()
    except KeyboardInterrupt:
        print("Finished")

    
main()
