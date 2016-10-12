/*
 The MIT License (MIT)

 Copyright (c) 2015 get-node-dimensions authors

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

export default function getCloneDimensions(node: HTMLElement, options: any): ClientRect {
  const { parentNode } = node;
  const context: HTMLElement = <HTMLElement>document.createElement('div');
  const clone: HTMLElement = <HTMLElement>node.cloneNode(true);
  const style: CSSStyleDeclaration = getComputedStyle(clone);

  // give the node some context to measure off of
  // no height and hidden overflow hide node copy
  context.style.height = '0';
  context.style.overflow = 'hidden';

  // clean up any attributes that might cause a conflict with the original node
  // i.e. inputs that should focus or submit data
  clone.setAttribute('id', '');
  clone.setAttribute('name', '');

  // set props to get a true dimension calculation
  clone.style.display = options.display || style.getPropertyValue('display');
  if (style.getPropertyValue('width') !== '') {
    clone.style.width = 'auto';
  }
  if (style.getPropertyValue('height') !== '') {
    clone.style.height = 'auto';
  }

  // append copy to context
  context.appendChild(clone);

  // append context to DOM so we can measure
  parentNode.appendChild(context);

  // get accurate width and height
  const rect = clone.getBoundingClientRect();

  // destroy clone
  parentNode.removeChild(context);

  return rect;
}

export function getNodeDimensions(node: HTMLElement, options: any = {}): ClientRect {
  let rect: ClientRect = node.getBoundingClientRect();

  if (!rect.width || !rect.height || options['clone']) {
    return getCloneDimensions(node, options);
  } else {
    return rect;
  }
}
