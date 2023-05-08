import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from "src/interfaces/todo.interface";

@Pipe({
  name: 'filterTags'
})
export class FilterTagsPipe implements PipeTransform {
  transform(tags: string[], todo: Todo, inputValue: string): string[] {
    const filterValue = inputValue.toLowerCase();

    return tags.filter(tag => {
      const isExisting = todo.tags.includes(tag);
      const isMatching = tag.toLowerCase().startsWith(filterValue);
      return !isExisting && isMatching;
    });
  }
}