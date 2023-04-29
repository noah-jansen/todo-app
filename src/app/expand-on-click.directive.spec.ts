import { ExpandOnClickDirective } from './expand-on-click.directive';
import { ElementRef, Renderer2 } from '@angular/core';
import { ExpandStateService } from './services/expanded-state.service';

describe('ExpandOnClickDirective', () => {
  it('should create an instance', () => {
    const el = new ElementRef(null);
    const renderer = {} as Renderer2;
    const expandedStateService = new ExpandStateService();
    const directive = new ExpandOnClickDirective(el, renderer, expandedStateService);
    expect(directive).toBeTruthy();
  });
});