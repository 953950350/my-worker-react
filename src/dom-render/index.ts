function transformName(
  shouldTranfromName: string[],
  nameMap: { [key: string]: string }
): (name: string) => string {
  return function (name: string): string {
    return shouldTranfromName.includes(name) ? nameMap[name] : name;
  };
}

const transformTagName: (name: string) => string = transformName(
  ["view", "image"],
  {
    view: "div",
    image: "img",
  }
);

const transformPropName: (name: string) => string = transformName(
  ["className"],
  {
    className: "class"
  }
);

export default class DomRender {
  vDom: any;
  container: any
  eventCallbackMap: { [key: string]: any } = {}

  constructor(patchs: { [key: string]: any }[], container: any) {
    this.vDom = {
      children: [],
      id: -1,
      type: 'view',
      props: {
        className: 'root'
      },
      text: undefined,
      nodes: {},
      el: document.querySelector('#root')
    };
    this.update(patchs)
    this.container = container
  }

  createDom(vDom: any): HTMLElement | Text {
    if (vDom.type === "plain-text") {
      return document.createTextNode(vDom.text)
    }
    const dom: HTMLElement = document.createElement(transformTagName(vDom.type));
    vDom.el = dom
    Object.keys(vDom.props).forEach((prop) =>
      this.setAttribute(dom, prop, vDom.props[prop])
    );
    vDom.children.forEach((id: number) => {
      const children = vDom.nodes[id];
      let childrenDom = this.createDom(children);
      dom.appendChild(childrenDom);
    });
    return dom;
  }

  setAttribute(el: HTMLElement, key: string, value: string, oldValue?: string) {
    key = transformPropName(key)
    if (key[0] === 'o' && key[1] === 'n') {
      key = key.slice(2).toLowerCase()
      if (oldValue && typeof this.eventCallbackMap[oldValue] === 'function') {
        el.removeEventListener(key, this.eventCallbackMap[oldValue])
      }
      this.eventCallbackMap[value] = (e: Event) => {
        this.fireEvent(value, e)
      }
      el.addEventListener(key, this.eventCallbackMap[value])
    } else {
      el.setAttribute(transformPropName(key), value)
    }
  }

  fireEvent(name: string, event: Event) {
    this.container.context[name](event)
  }

  updateChildren(patch: { [key: string]: any }) {
    const parent = this.getVDomForPath(patch.parentPath)
    const newChildren = patch.value.slice()
    const childNodesList = parent.el.childNodes
    parent.children.forEach((children: number, index: number) => {
      const isDelete = newChildren.indexOf(children) === -1
      if (isDelete) {
        const childNode = childNodesList[index]
        parent.el.removeChild(childNode)
      }
    })
    parent.children = patch.value
  }
  getVDomForPath(path: string[]): any {
    let vDom = this.vDom
    path.forEach((path: string) => vDom = vDom[path])
    return vDom
  }
  updateNodes(patch: { [key: string]: any }) {
    let parent = this.getVDomForPath(patch.parentPath)
    const index = parent.children.indexOf(Number(patch.id))
    const parentEl = parent.el
    const childNodesList = parentEl.childNodes
    // 没有值就是删除元素, 该元素的真实dom已经在updateChildren时删除掉了
    if (!patch.value) {
      delete parent.nodes[patch.id]
      return
    }
    // 在nodes存在以该id为key的值就是更新
    const isUpdate = Object.keys(parent.nodes).indexOf(patch.id) !== -1
    const newNode = this.createDom(patch.value)
    parent.nodes[patch.id] = patch.value
    if (isUpdate) {
      const oldNode = childNodesList[index]
      parentEl.replaceChild(newNode, oldNode)
      return
    }

    if (index === 0) {
      if (childNodesList.length > 0) {
        parentEl.insertBefore(newNode, childNodesList[0])
      } else {
        parentEl.appendChild(newNode)
      }
      return
    }
    if (index === parent.children.length - 1) {
      parentEl.appendChild(newNode)
      return
    }
    parentEl.insertBefore(newNode, childNodesList[index + 1])
  }
  updateProps(patch: { [key: string]: any }) {
    const parent = this.getVDomForPath(patch.parentPath)
    if (patch.value === null || patch.value === false) {
      delete parent.props[patch.updateName]
      parent.el.removeAttribute(transformPropName(patch.updateName))
    } else {
      this.setAttribute(parent.el, patch.updateName, patch.value, parent.props[patch.updateName])
    }
  }
  update(patchs: { [key: string]: any }[]) {
    patchs.forEach(patch => {
      switch(patch.attribute) {
        case 'children':
          this.updateChildren(patch)
          break
        case 'nodes':
          this.updateNodes(patch)
          break
        case 'props':
          this.updateProps(patch)
      }
    })
  }
}
