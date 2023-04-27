import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ExpandStateService } from './services/expanded-state.service';

@Directive({
  selector: '[appExpandOnClick]',
})
export class ExpandOnClickDirective {
  private isExpanded: boolean = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private expandStateService: ExpandStateService
  ) {}

  @HostListener('dblclick') onMouseDoubleClick() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.renderer.addClass(this.el.nativeElement, 'expanded');
      this.expandStateService.setExpandedElement(this);
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'expanded');
      this.expandStateService.removeExpandedElement(this);
    }
  }

  @HostListener('document:click', ['$event.target']) onDocumentClick(target: HTMLElement) {
    if (this.isExpanded && !this.el.nativeElement.contains(target)) {
      this.collapse();
    }
  }

  collapse() {
    this.isExpanded = false;
    this.renderer.removeClass(this.el.nativeElement, 'expanded');
  }
}