import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExpandStateService {
  private expandedElement: any;

  setExpandedElement(element: any): void {
    if (this.expandedElement && this.expandedElement !== element) {
      this.expandedElement.collapse();
    }
    this.expandedElement = element;
  }

  removeExpandedElement(element: any): void {
    if (this.expandedElement === element) {
      this.expandedElement = null;
    }
  }
}