import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericInputFieldValidation]'
})
export class NumericInputFieldValidationDirective {

  // private regex: RegExp = /^-?\d*.?\d{0,2}$/;

  private regex1: RegExp = /^-?\d*(\.\d{0,2})?$/;
  
  // private regex1n: RegExp = /^(?!-?\d+(\.\d{0,2})?$).*$/

  constructor(private el: ElementRef) {}

  @HostListener('keyup', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;
    const isValid = this.regex1.test(inputValue);

    // console.log(inputValue)

    if (!isValid) {
      // console.log(inputElement.value)
      // console.log(inputValue.match(this.regex1n))
      inputElement.value = inputValue.replace(this.regex1, '');
      // event.stopImmediatePropagation();
      // event.preventDefault();
      // event.stopPropagation();
    }
  }
}