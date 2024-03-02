import { Directive, ElementRef, Renderer2, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appSetMaxHeight]'
})
export class SetMaxHeightDirective implements OnChanges {
  @Input() chartRenderComplete: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['this.chartService.renderComplete'] && this.chartRenderComplete == true) {
      this.setMaxHeight();
    };
  }

  setMaxHeight(): void {
    // Get the height from the source element
    const sourceElement = document.querySelector('.span-result__graph-tab') as HTMLElement;
    const sourceElementHeight = sourceElement.offsetHeight;
    
    // Set max height of the target element
    this.renderer.setStyle(this.el.nativeElement, 'max-height', `${sourceElementHeight}px`);

  }

}
