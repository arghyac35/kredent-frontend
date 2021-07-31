import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  pure: true,
})
export class NameInitialsPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      let names = value.split(' ');
      value = names[0].substring(0, 1).toUpperCase();

      if (names.length > 1) {
        value += names[names.length - 1].substring(0, 1).toUpperCase();
      }
    }
    return value;
  }
}
