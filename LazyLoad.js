const DEFAULTOPTS = {
  delay: 200,
  useDebounce: true,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
}
export default class Lazy {
  constructor (options) {
    this.opts = this.extend({}, DEFAULTOPTS, options);
    this.init();
    this.timer = null;
    this.render();
  }

  init () {
    this.viewRect = {
      top: 0 + parseInt(this.opts.top, 10),
      left: 0 + parseInt(this.opts.left, 10),
      right: document.body.clientWidth - parseInt(this.opts.right, 10),
      bottom: document.body.clientHeight - parseInt(this.opts.bottom, 10)
    }
    document.addEventListener('scroll', this.handlerScroll.bind(this))
  }

  handlerScroll () {
    if (this.opts.useDebounce) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.render()
        this.timer = null
      }, this.opts.delay)
    } else {
      this.render()
    }
  }

  render () {
    let nodes = document.querySelectorAll("[data-lazy-src], [data-lazy-bg]")
    let el = null
    let url = ''
    for(let i = 0; i < nodes.length; i ++) {
      el = nodes[i]
      if (this.checkInView(el)) {
        url = el.getAttribute('data-lazy-src') || el.getAttribute('data-lazy-bg')
        if (el.getAttribute('data-lazy-bg') != null) {
          el.style.background = `url(${url})`
        } else if (el.src != url) {
          el.src = url
        }
      }
    }
  }

  checkInView (dom) {
    let rect = dom.getBoundingClientRect()
    return rect.top >= this.viewRect.top && rect.left >= this.viewRect.left && rect.right <= this.viewRect.right && rect.bottom <= this.viewRect.bottom
  }

  extend (target, ...arg) {
    for (let i = 0; i < arg.length; i ++) {
      for (let key in arg[i]) {
        if (arg[i].hasOwnProperty(key)) {
          target[key] = arg[i][key]
        }
      }
    }
    return target
  }

}