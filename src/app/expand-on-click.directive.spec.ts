import { ExpandOnClickDirective } from './expand-on-click.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('ExpandOnClickDirective', () => {
  it('should create an instance', () => {
    const el = new ElementRef(null);
    const renderer = {} as Renderer2;
    const directive = new ExpandOnClickDirective(el, renderer);
    expect(directive).toBeTruthy();
  });
});