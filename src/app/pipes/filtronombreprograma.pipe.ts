import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtronombreprograma',
})
export class FiltronombreprogramaPipe implements PipeTransform {
  transform(value: any, arg: any): any {
    if (
      arg === null ||
      arg === undefined ||
      value === undefined ||
      arg === ''
    ) {
      return value;
    }
    const resultPosts = [];
    for (const post of value) {
      if (typeof post.registroSnies === 'string' && typeof arg === 'string') {
        if (
          post.uaa.nombreCorto.toLowerCase().indexOf(arg.toLowerCase()) > -1 ||
          post.registroSnies.indexOf(arg) > -1
        ) {
          resultPosts.push(post);
        }
      }
    }
    return resultPosts;
  }
}
