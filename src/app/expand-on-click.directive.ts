import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ExpandStateService } from './services/expanded-state.service';

@Directive({
  selector: '[appNoCollapseOnClick]',
})
export class NoCollapseOnClickDirective {}

@Directive({
  selector: '[appExpandOnClick]',
})

export class ExpandOnClickDirective {
  private isExpanded: boolean = false;
  todoServices: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private expandStateService: ExpandStateService,
  ) {}

  @HostListener('dblclick') onMouseDoubleClick() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.renderer.addClass(this.el.nativeElement, 'expanded');
      this.expandStateService.setExpandedElement(this);
      this.todoServices.currentOpenTodo = this;
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'expanded');
      this.expandStateService.removeExpandedElement(this);
      this.todoServices.currentOpenTodo = null;
    }
  }

  @HostListener('document:click', ['$event.target'])
onDocumentClick(target: HTMLElement) {
  // Check if the clicked element is the card or a child element of the card
  if (this.el.nativeElement === target || this.el.nativeElement.contains(target)) {
    return;
  }

  if (this.isExpanded) {
    this.collapse();
  }
}

  collapse() {
    this.isExpanded = false;
    this.renderer.removeClass(this.el.nativeElement, 'expanded');
  }
}