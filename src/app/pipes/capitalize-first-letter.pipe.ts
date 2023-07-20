import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstLetter',
})
export class CapitalizeFirstLetterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Convertimos todo el texto a minúsculas
    const lowerCaseText = value.toLowerCase();

    // Convertimos la primera letra a mayúscula
    const result =
      lowerCaseText.charAt(0).toUpperCase() + lowerCaseText.slice(1);

    return result;
  }
}