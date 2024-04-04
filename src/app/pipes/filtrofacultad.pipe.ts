import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrofacultad',
})
export class FiltrofacultadPipe implements PipeTransform {
  transform(value: any, arg: any): any {
    if (arg === null || arg === undefined || value === undefined) {
      return value;
    }
    const resultPosts = [];
    for (const post of value) {
      if (post.uaa.uaa_dependencia === arg) {
        resultPosts.push(post);
      }
    }
    return resultPosts;
  }
}
