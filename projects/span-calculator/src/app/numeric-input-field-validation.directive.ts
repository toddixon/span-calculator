import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericInputFieldValidation]'
})
export class NumericInputFieldValidationDirective {
  private regex1 = /^-?\d*(\.\d{0,2})?$/;

  constructor(private el: ElementRef) {}

  @HostListener('keyup', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;
    const isValid = this.regex1.test(inputValue);

    if (!isValid) {
      inputElement.value = inputValue.replace(this.regex1, '');
    }
  }
}