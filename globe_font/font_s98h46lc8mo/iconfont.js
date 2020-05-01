!(function (s) {
  var e,
    l =
      '<svg><symbol id="icon-xingxing" viewBox="0 0 1024 1024"><path d="M949.12 386.592c-4.864-15.008-17.856-25.952-33.44-28.192l-256.992-37.344-114.944-232.896c-6.976-14.144-21.376-23.104-37.152-23.104-15.776 0-30.176 8.96-37.152 23.104l-114.944 232.896L97.472 358.4c-15.616 2.272-28.576 13.184-33.44 28.192s-0.8 31.456 10.496 42.464l185.984 181.28-43.904 255.968c-2.656 15.552 3.712 31.264 16.48 40.544 12.768 9.28 29.664 10.496 43.648 3.136l229.888-120.864 229.856 120.864c6.048 3.168 12.672 4.768 19.264 4.768 8.576 0 17.152-2.656 24.352-7.904 12.768-9.28 19.136-24.992 16.48-40.544l-43.904-255.968 185.984-181.28C949.92 418.048 953.984 401.6 949.12 386.592z"  ></path></symbol><symbol id="icon-xingxing1" viewBox="0 0 1024 1024"><path d="M943.2 412.4c-4.2-12.8-14.7-22.5-27.8-25.7l-241.6-58.3-130.2-211.8c-7.1-11.5-19.6-18.5-33-18.5-13.5 0-26 7-33 18.5L347.5 328.4l-241.6 58.3c-13.1 3.2-23.6 12.9-27.8 25.7-4.2 12.8-1.4 26.9 7.4 37.1l161.2 189.2-19.2 247.8c-1 13.4 5 26.4 15.9 34.3 6.7 4.9 14.7 7.4 22.8 7.4 5 0 10-1 14.8-2.9l229.7-94.9 229.8 94.9c4.8 2 9.8 2.9 14.8 2.9 8.1 0 16-2.5 22.8-7.4 10.9-7.9 16.9-20.9 15.9-34.3l-19.2-247.8L936 449.5c8.5-10.2 11.3-24.3 7.2-37.1zM734.7 625.8l20.5 263.8-244.6-101-244.5 101 20.5-263.8-171.7-201.4 257.2-62L510.6 137l138.5 225.4 257.2 62-171.6 201.4z"  ></path></symbol><symbol id="icon-cl-icon-left" viewBox="0 0 1024 1024"><path d="M384.4 512l318.8-318.8c11.7-11.7 11.7-30.7 0-42.4s-30.7-11.7-42.4 0L342 469.6l-21.2 21.2c-11.7 11.7-11.7 30.7 0 42.4l21.2 21.2 318.8 318.8c11.7 11.7 30.7 11.7 42.4 0s11.7-30.7 0-42.4L384.4 512z"  ></path></symbol><symbol id="icon-cl-icon-right" viewBox="0 0 1024 1024"><path d="M639.6 512L320.8 830.8c-11.7 11.7-11.7 30.7 0 42.4s30.7 11.7 42.4 0L682 554.4l21.2-21.2c11.7-11.7 11.7-30.7 0-42.4L682 469.6 363.2 150.8c-11.7-11.7-30.7-11.7-42.4 0s-11.7 30.7 0 42.4L639.6 512z"  ></path></symbol></svg>',
    t = (e = document.getElementsByTagName("script"))[
      e.length - 1
    ].getAttribute("data-injectcss");
  if (t && !s.__iconfont__svg__cssinject__) {
    s.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>"
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  !(function (e) {
    if (document.addEventListener)
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState))
        setTimeout(e, 0);
      else {
        var t = function () {
          document.removeEventListener("DOMContentLoaded", t, !1), e();
        };
        document.addEventListener("DOMContentLoaded", t, !1);
      }
    else
      document.attachEvent &&
        ((o = e),
        (i = s.document),
        (c = !1),
        (l = function () {
          try {
            i.documentElement.doScroll("left");
          } catch (e) {
            return void setTimeout(l, 50);
          }
          n();
        })(),
        (i.onreadystatechange = function () {
          "complete" == i.readyState && ((i.onreadystatechange = null), n());
        }));
    function n() {
      c || ((c = !0), o());
    }
    var o, i, c, l;
  })(function () {
    var e, t, n, o, i, c;
    ((e = document.createElement("div")).innerHTML = l),
      (l = null),
      (t = e.getElementsByTagName("svg")[0]) &&
        (t.setAttribute("aria-hidden", "true"),
        (t.style.position = "absolute"),
        (t.style.width = 0),
        (t.style.height = 0),
        (t.style.overflow = "hidden"),
        (n = t),
        (o = document.body).firstChild
          ? ((i = n), (c = o.firstChild).parentNode.insertBefore(i, c))
          : o.appendChild(n));
  });
})(window);
